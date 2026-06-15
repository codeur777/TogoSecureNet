"""
Service de reconnaissance faciale utilisant InsightFace (ArcFace 512D)
Compatible avec le système TogoSecureNet
"""
import cv2
import numpy as np
import os
import pickle

try:
    from insightface.app import FaceAnalysis
    INSIGHTFACE_AVAILABLE = True
except ImportError:
    print("[AVERTISSEMENT] insightface non installé")
    INSIGHTFACE_AVAILABLE = False

class RecognitionService:
    def __init__(self):
        """Initialise le modèle ArcFace"""
        self.app = None
        
        if not INSIGHTFACE_AVAILABLE:
            print("[ERREUR] InsightFace non disponible - service désactivé")
            return
        
        try:
            self.app = FaceAnalysis(
                name="buffalo_s",
                providers=["CPUExecutionProvider"]
            )
            self.app.prepare(ctx_id=0, det_size=(640, 640))
            print("[INIT] Service de reconnaissance ArcFace prêt ✅")
        except Exception as e:
            print(f"[ERREUR] Impossible d'initialiser ArcFace: {str(e)}")
            self.app = None
    
    @staticmethod
    def cosine_distance(a, b):
        """Calcule la distance cosinus entre deux vecteurs"""
        a, b = np.array(a), np.array(b)
        return 1.0 - np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
    
    def analyze_image_quality(self, image_path: str):
        """
        Analyse la qualité de l'image pour la reconnaissance faciale.
        Retourne un score de confiance et si l'image est exploitable.
        """
        if self.app is None:
            return {
                "success": False,
                "message": "Service de reconnaissance non initialisé",
                "details": None
            }
        
        try:
            # Charger l'image
            image = cv2.imread(image_path)
            
            if image is None:
                return {
                    "success": False,
                    "message": "Impossible de charger l'image",
                    "details": None
                }
            
            # Détection de visages avec ArcFace
            faces = self.app.get(image)
            
            if not faces:
                return {
                    "success": False,
                    "message": "Aucun visage détecté sur l'image.",
                    "details": None
                }
            
            if len(faces) > 1:
                return {
                    "success": False,
                    "message": "Plusieurs visages détectés. Veuillez uploader une photo avec une seule personne.",
                    "details": {"face_count": len(faces)}
                }

            # Vérifier la qualité de l'embedding
            face = faces[0]
            bbox = face.bbox.astype(int)
            
            # Calculer la taille du visage
            face_width = bbox[2] - bbox[0]
            face_height = bbox[3] - bbox[1]
            face_area = face_width * face_height
            image_area = image.shape[0] * image.shape[1]
            face_ratio = face_area / image_area
            
            if face_ratio < 0.05:  # Visage trop petit
                return {
                    "success": False,
                    "message": "Visage trop petit. Rapprochez-vous ou recadrez l'image.",
                    "details": {"face_ratio": face_ratio}
                }
            
            return {
                "success": True,
                "message": "Qualité d'image optimale pour la recherche.",
                "details": {
                    "face_detected": True,
                    "encoding_ready": True,
                    "embedding_dims": 512,
                    "face_bbox": bbox.tolist(),
                    "face_ratio": round(face_ratio, 4)
                }
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Erreur lors de l'analyse IA : {str(e)}",
                "details": None
            }

    def save_face_encoding(self, person_id: int, image_path: str, encoding_dir: str = "uploads/encodings"):
        """
        Extrait et sauvegarde l'embedding ArcFace 512D
        """
        if self.app is None:
            return None
        
        if not os.path.exists(encoding_dir):
            os.makedirs(encoding_dir)
        
        try:
            image = cv2.imread(image_path)
            if image is None:
                return None
            
            faces = self.app.get(image)
            
            if faces:
                encoding = faces[0].embedding
                
                # 1. Sauvegarde disque (Backup)
                encoding_path = os.path.join(encoding_dir, f"person_{person_id}.pkl")
                with open(encoding_path, 'wb') as f:
                    pickle.dump(encoding, f)
                
                # 2. Mise en cache Redis (Vitesse)
                try:
                    from app.redis_client import redis_client
                    redis_client.set(f"encoding:person:{person_id}", encoding.tobytes())
                except Exception as e:
                    print(f"[AVERTISSEMENT] Redis non disponible: {str(e)}")
                
                return encoding_path
            return None
        except Exception as e:
            print(f"[ERREUR] save_face_encoding: {str(e)}")
            return None

    @staticmethod
    def get_all_active_encodings():
        """
        Récupère tous les encodings depuis Redis ou disque.
        """
        try:
            from app.redis_client import redis_client
            keys = redis_client.keys("encoding:person:*")
            
            encodings = []
            person_ids = []
            
            for key in keys:
                p_id = int(key.decode().split(":")[-1])
                data = redis_client.get(key)
                encoding = np.frombuffer(data, dtype=np.float32)  # ArcFace utilise float32
                encodings.append(encoding)
                person_ids.append(p_id)
            
            return encodings, person_ids
        except Exception as e:
            print(f"[ERREUR] get_all_active_encodings: {str(e)}")
            return [], []
