"""
Service d'extraction des vecteurs faciaux (embeddings) pour les personnes disparues
Utilise InsightFace avec le modèle ArcFace 512D (buffalo_s)
"""
import os
import numpy as np
import json
from typing import List, Dict, Optional

# Utiliser opencv-python-headless (sans dépendances GUI)
import cv2

try:
    from insightface.app import FaceAnalysis
except ImportError:
    print("[ERREUR] insightface non installé. Exécutez: pip install insightface onnxruntime")
    FaceAnalysis = None


class FaceEmbeddingExtractor:
    """Extracteur de vecteurs faciaux pour la reconnaissance avec ArcFace 512D"""
    
    def __init__(self, model_name: str = "buffalo_s"):
        """
        Initialize ArcFace model
        Args:
            model_name: InsightFace model name (buffalo_s = lightweight CPU model with ArcFace 512D)
        """
        self.model_name = model_name
        self.app = None
        
        if FaceAnalysis is None:
            print("[ERREUR] InsightFace non disponible")
            return
            
        try:
            print(f"[INIT] Chargement du modèle ArcFace 512D ({model_name})...")
            self.app = FaceAnalysis(
                name=model_name,
                providers=["CPUExecutionProvider"]
            )
            self.app.prepare(ctx_id=0, det_size=(640, 640))
            print("[INIT] Modèle ArcFace prêt ✅")
        except Exception as e:
            print(f"[ERREUR] Impossible de charger InsightFace: {str(e)}")
            self.app = None
    
    def extract_from_file(self, image_path: str) -> Optional[List[float]]:
        """
        Extrait le vecteur facial ArcFace 512D d'une seule image
        
        Args:
            image_path: Chemin vers l'image
            
        Returns:
            Liste de floats représentant l'embedding 512D, ou None si échec
        """
        if self.app is None:
            print("[ERREUR] Modèle ArcFace non initialisé")
            return None
        
        try:
            # Charger l'image
            img = cv2.imread(image_path)
            
            if img is None:
                print(f"[ERREUR] Impossible de charger l'image: {image_path}")
                return None
            
            # Extraire les visages avec ArcFace
            faces = self.app.get(img)
            
            if not faces:
                print(f"[ERREUR] Aucun visage détecté dans: {image_path}")
                return None
            
            if len(faces) > 1:
                print(f"[AVERTISSEMENT] Plusieurs visages détectés ({len(faces)}), utilisation du premier")
            
            # Récupérer l'embedding du premier visage (512 dimensions)
            embedding = faces[0].embedding
            
            # Convertir numpy array en liste Python
            embedding_list = embedding.tolist()
            
            print(f"[SUCCESS] Embedding ArcFace extrait: {len(embedding_list)} dimensions")
            return embedding_list
            
        except Exception as e:
            print(f"[ERREUR] Extraction embedding ArcFace: {str(e)}")
            import traceback
            traceback.print_exc()
            return None
    
    def extract_from_multiple_files(self, image_paths: List[str]) -> Dict[str, List[float]]:
        """
        Extrait les vecteurs faciaux ArcFace de plusieurs images
        
        Args:
            image_paths: Liste des chemins d'images
            
        Returns:
            Dictionnaire {filename: embedding}
        """
        embeddings = {}
        
        for img_path in image_paths:
            filename = os.path.basename(img_path)
            embedding = self.extract_from_file(img_path)
            
            if embedding is not None:
                embeddings[filename] = embedding
        
        return embeddings
    
    def extract_from_urls(self, photo_urls: List[str], base_path: str = "uploads/signalements") -> Optional[Dict]:
        """
        Extrait les vecteurs faciaux ArcFace 512D à partir des URLs de photos
        
        Args:
            photo_urls: Liste des URLs (ex: ["/static/signalements/uuid.jpg"])
            base_path: Chemin de base vers les fichiers
            
        Returns:
            Dictionnaire contenant les embeddings et métadonnées
        """
        embeddings = []
        successful_extractions = 0
        
        for url in photo_urls:
            # Extraire le nom du fichier de l'URL
            filename = url.split('/')[-1]
            file_path = os.path.join(base_path, filename)
            
            if not os.path.exists(file_path):
                print(f"[AVERTISSEMENT] Fichier introuvable: {file_path}")
                continue
            
            # Extraire l'embedding
            embedding = self.extract_from_file(file_path)
            
            if embedding is not None:
                embeddings.append({
                    "filename": filename,
                    "embedding": embedding,
                    "dimensions": len(embedding)
                })
                successful_extractions += 1
        
        if successful_extractions == 0:
            return None
        
        return {
            "embeddings": embeddings,
            "total_photos": len(photo_urls),
            "successful_extractions": successful_extractions,
            "model": f"ArcFace-{self.model_name}"
        }


def extract_embeddings_for_person(photo_urls: List[str]) -> Optional[str]:
    """
    Fonction utilitaire pour extraire les embeddings ArcFace d'une personne
    
    Args:
        photo_urls: Liste des URLs des photos
        
    Returns:
        JSON string contenant les embeddings ou None
    """
    try:
        extractor = FaceEmbeddingExtractor()
        result = extractor.extract_from_urls(photo_urls)
        
        if result is None:
            return None
        
        return json.dumps(result)
        
    except Exception as e:
        print(f"[ERREUR GLOBALE] Extraction embeddings: {str(e)}")
        import traceback
        traceback.print_exc()
        return None
