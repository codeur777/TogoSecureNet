import cv2
import time
import os
import requests
import numpy as np
import face_recognition
from config import *
from mqtt_client import TogoMQTTClient
from face_detector import TogoSecureAI

def main():
    print(f"Démarrage de la caméra {CAMERA_ID} ({CAMERA_LOCATION})...")
    
    # Initialisation
    mqtt = TogoMQTTClient()
    detector = TogoSecureAI()
    
    # Capture vidéo (0 = webcam par défaut)
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Erreur: Impossible d'accéder à la caméra.")
        return

    last_analysis_time = 0
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
                
            current_time = time.time()
            
            # Analyser à intervalle régulier
            if current_time - last_analysis_time > ANALYSIS_INTERVAL:
                # Analyse hybride (YOLO + Face Rec)
                results = detector.analyze_frame(frame)
                
                print(f"--- Analyse: {results['persons_count']} personne(s) détectée(s) ---")
                
                for det in results['detections']:
                    if det['is_wanted']:
                        print(f"ALERTE CRITIQUE! {det['name']} identifié!")
                        mqtt.publish_alert(det['person_id'], det['name'])
                    else:
                        print("Présence inconnue détectée")
                
                last_analysis_time = current_time
                
                # Envoyer heartbeat
                mqtt.publish_heartbeat()
            
            # Affichage (optionnel pour simulation)
            cv2.imshow('Togo SecureNet - Edge Simulator', frame)
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
                
    finally:
        cap.release()
        cv2.destroyAllWindows()
        mqtt.disconnect()

if __name__ == "__main__":
    main()
