import cv2
import face_recognition
import numpy as np
import requests
from config import *

class TogoFaceDetector:
    def __init__(self):
        self.known_face_encodings = []
        self.known_face_names = []
        self.known_face_ids = []
        self.load_known_faces()

    def load_known_faces(self):
        """Récupère les visages connus depuis l'API centrale"""
        try:
            # En production, on ferait un appel API ici
            # response = requests.get(f"{API_URL}/persons/embeddings")
            # data = response.json()
            # Simulation:
            print("Chargement des visages connus...")
            pass
        except Exception as e:
            print(f"Erreur lors du chargement des visages: {e}")

    def analyze_frame(self, frame):
        # Redimensionner pour accélérer le traitement
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

        # Détecter les visages
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        results = []
        for face_encoding in face_encodings:
            # Comparer avec les visages connus
            matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding, tolerance=FACE_MATCH_TOLERANCE)
            name = "Inconnu"
            person_id = None
            known = False

            if True in matches:
                first_match_index = matches.index(True)
                name = self.known_face_names[first_match_index]
                person_id = self.known_face_ids[first_match_index]
                known = True

            results.append({
                "name": name,
                "person_id": person_id,
                "known": known
            })
        
        return results
