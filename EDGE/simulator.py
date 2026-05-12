import paho.mqtt.client as mqtt
import json
import time
import os

# Configuration
MQTT_BROKER = "localhost"
MQTT_PORT = 1884 # Port exposé dans docker-compose
TOPIC_ALERTS = "togo/securenet/alerts/cam1"

def simulate_detection(image_name, camera_id=1):
    """
    Simule la détection d'un visage par une caméra Edge.
    Envoie le chemin de l'image au backend via MQTT.
    """
    client = mqtt.Client()
    
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        print(f"Connected to EMQX on {MQTT_BROKER}:{MQTT_PORT}")
        
        # Le chemin de l'image doit être accessible par le container Backend
        # On utilise le volume partagé 'BACKEND/uploads'
        payload = {
            "camera_id": camera_id,
            "image_path": f"uploads/persons/{image_name}",
            "timestamp": time.time()
        }
        
        print(f"Sending detection alert: {image_name}")
        client.publish(TOPIC_ALERTS, json.dumps(payload))
        print("Alert published successfully.")
        
        client.disconnect()
    except Exception as e:
        print(f"Error in simulator: {e}")

if __name__ == "__main__":
    # Liste des images disponibles dans BACKEND/uploads/persons
    print("=== Togo SecureNet Camera Simulator ===")
    img = input("Entrez le nom de l'image à simuler (ex: photo_test.jpg) : ")
    simulate_detection(img)
