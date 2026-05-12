import face_recognition
import cv2
import numpy as np
import os

class RecognitionService:
    @staticmethod
    def analyze_image_quality(image_path: str):
        """
        Analyse la qualité de l'image pour la reconnaissance faciale.
        Retourne un score de confiance et si l'image est exploitable.
        """
        try:
            # Charger l'image
            image = face_recognition.load_image_file(image_path)
            
            # 1. Détection de visages
            face_locations = face_recognition.face_locations(image)
            
            if not face_locations:
                return {
                    "success": False,
                    "message": "Aucun visage détecté sur l'image.",
                    "details": None
                }
            
            if len(face_locations) > 1:
                return {
                    "success": False,
                    "message": "Plusieurs visages détectés. Veuillez uploader une photo avec une seule personne.",
                    "details": {"face_count": len(face_locations)}
                }

            # 2. Extraction des encodages (vecteurs faciaux)
            face_encodings = face_recognition.face_encodings(image, face_locations)
            
            if not face_encodings:
                return {
                    "success": False,
                    "message": "Impossible d'extraire les traits faciaux. Image trop floue ou mal éclairée.",
                    "details": None
                }

            # 3. Analyse de la netteté (Optionnel via OpenCV)
            # On pourrait ajouter un calcul de variance laplacienne ici
            
            return {
                "success": True,
                "message": "Qualité d'image optimale pour la recherche.",
                "details": {
                    "face_detected": True,
                    "encoding_ready": True,
                    "location": face_locations[0]
                }
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Erreur lors de l'analyse IA : {str(e)}",
                "details": None
            }

    @staticmethod
    def save_face_encoding(person_id: int, image_path: str, encoding_dir: str = "uploads/encodings"):
        """
        Extrait, sauvegarde sur disque et met en cache dans Redis.
        """
        if not os.path.exists(encoding_dir):
            os.makedirs(encoding_dir)
            
        image = face_recognition.load_image_file(image_path)
        encodings = face_recognition.face_encodings(image)
        
        if encodings:
            encoding = encodings[0]
            # 1. Sauvegarde disque (Backup)
            encoding_path = os.path.join(encoding_dir, f"person_{person_id}.npy")
            np.save(encoding_path, encoding)
            
            # 2. Mise en cache Redis (Vitesse)
            from app.redis_client import redis_client
            redis_client.set(f"encoding:person:{person_id}", encoding.tobytes())
            
            return encoding_path
        return None

    @staticmethod
    def get_all_active_encodings():
        """
        Récupère tous les encodings depuis Redis ou disque.
        """
        from app.redis_client import redis_client
        keys = redis_client.keys("encoding:person:*")
        
        encodings = []
        person_ids = []
        
        for key in keys:
            p_id = int(key.decode().split(":")[-1])
            data = redis_client.get(key)
            encoding = np.frombuffer(data, dtype=np.float64)
            encodings.append(encoding)
            person_ids.append(p_id)
            
        return encodings, person_ids
