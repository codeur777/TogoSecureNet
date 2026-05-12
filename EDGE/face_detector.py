import cv2
import face_recognition
import numpy as np
import requests
from ultralytics import YOLO
from config import *

class TogoSecureAI:
    def __init__(self):
        # Initialisation de YOLOv8 (modèle Nano pour la rapidité sur l'Edge)
        print("Chargement du modèle YOLOv8...")
        # Note: Le modèle sera téléchargé automatiquement au premier lancement (6MB)
        self.model = YOLO('yolov8n.pt') 
        
        self.known_face_encodings = []
        self.known_face_names = []
        self.known_face_ids = []
        self.load_known_faces()

    def load_known_faces(self):
        """Récupère les visages connus depuis l'API centrale"""
        try:
            print(f"AI: [Sync] Connexion à {API_URL}/persons/embeddings...")
            response = requests.get(f"{API_URL}/persons/embeddings")
            if response.status_code == 200:
                data = response.json()
                self.known_face_encodings = [np.array(p['encoding']) for p in data]
                self.known_face_names = [p['name'] for p in data]
                self.known_face_ids = [p['id'] for p in data]
                print(f"AI: [Sync] {len(self.known_face_ids)} signature(s) faciale(s) synchronisée(s).")
            else:
                print(f"AI: [Sync] Échec de la synchronisation (Code: {response.status_code})")
        except Exception as e:
            print(f"AI: [Sync] Erreur lors de la synchronisation: {e}")

    def analyze_frame(self, frame):
        """
        Analyse optimisée pour la fluidité (YOLOv8 rapide + FaceRec sélectif)
        """
        # 1. Détection ultra-rapide avec YOLOv8 (imgsz réduit à 320 pour la vitesse)
        yolo_results = self.model(frame, classes=[0, 67], verbose=False, imgsz=320)[0]
        
        persons_detected = 0
        phone_detected = False
        detections = []
        
        for box in yolo_results.boxes:
            cls = int(box.cls[0])
            if cls == 0: persons_detected += 1
            if cls == 67: phone_detected = True

        # Alerte immédiate pour le téléphone (Priorité Haute)
        if phone_detected:
            print(f"AI: [!!!] TÉLÉPHONE DÉTECTÉ !")
            detections.append({
                "type": "OBJECT_DETECTED",
                "name": "Téléphone Portable",
                "person_id": None,
                "is_wanted": True,
                "priority": "high"
            })

        # 2. Identification faciale (SEULEMENT si une personne est détectée)
        # On ne lance FaceRec que si nécessaire car c'est l'étape la plus lente
        if persons_detected > 0:
            # Redimensionnement agressif pour FaceRec
            small_frame = cv2.resize(frame, (0, 0), fx=0.2, fy=0.2)
            rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

            face_locations = face_recognition.face_locations(rgb_small_frame)
            if face_locations:
                face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

                for i, face_encoding in enumerate(face_encodings):
                    matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding, tolerance=FACE_MATCH_TOLERANCE)
                    name = "Inconnu"
                    person_id = None
                    known = False
                    priority = "low"

                    if True in matches:
                        first_match_index = matches.index(True)
                        name = self.known_face_names[first_match_index]
                        person_id = self.known_face_ids[first_match_index]
                        known = True
                        priority = "critical"
                        print(f"AI: [!!!] MATCH TROUVÉ: {name}")

                    detections.append({
                        "type": "FACE_RECOGNIZED",
                        "name": name,
                        "person_id": person_id,
                        "is_wanted": known,
                        "priority": priority
                    })

        return {
            "persons_count": persons_detected,
            "phone_detected": phone_detected,
            "detections": detections,
            "boxes": yolo_results.boxes.xyxy.tolist() if len(yolo_results.boxes) > 0 else []
        }
