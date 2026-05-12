import json
import paho.mqtt.client as mqtt
from app.core.config import settings
from app.api.websocket import manager as ws_manager
from app.core.database import SessionLocal
from app.models.alert import Alert
from app.models.person import Person
from app.services.recognition import RecognitionService
import asyncio
import os
import numpy as np
import face_recognition

def on_connect(client, userdata, flags, rc):
    print(f"MQTT Connected with result code {rc}")
    client.subscribe("togo/securenet/alerts/+")

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        print(f"Received alert on {msg.topic}: {payload}")
        
        # Lancer le traitement asynchrone
        asyncio.run(process_mqtt_alert(payload))
    except Exception as e:
        print(f"Error processing MQTT message: {e}")

async def process_mqtt_alert(payload):
    db = SessionLocal()
    try:
        camera_id = payload.get("camera_id")
        captured_photo_path = payload.get("image_path") # Chemin local ou base64
        
        # 1. Charger la photo capturée
        if not os.path.exists(captured_photo_path):
            print(f"Image not found at {captured_photo_path}")
            return

        captured_image = face_recognition.load_image_file(captured_photo_path)
        captured_encodings = face_recognition.face_encodings(captured_image)

        if not captured_encodings:
            print("No face detected in captured image")
            return

        # 2. Comparer avec les personnes recherchées (via Redis Cache)
        known_encodings, person_ids = RecognitionService.get_all_active_encodings()
        
        if not known_encodings:
            print("No active target encodings in cache")
            return

        matches = face_recognition.compare_faces(known_encodings, captured_encodings[0], tolerance=0.6)
        
        match_found = False
        matched_person_id = None
        
        if True in matches:
            first_match_index = matches.index(True)
            matched_person_id = person_ids[first_match_index]
            match_found = True

        # 3. Créer une alerte si match
        if match_found:
            matched_person = db.query(Person).filter(Person.id == matched_person_id).first()
            if not matched_person: return

            new_alert = Alert(
                person_id=matched_person.id,
                camera_id=camera_id,
                captured_photo_url=captured_photo_path.replace("uploads/", "/static/"),
                confidence=0.95, # Simulation
                gravity_level=matched_person.gravity_level,
                status="pending"
            )
            db.add(new_alert)
            db.commit()
            db.refresh(new_alert)

            # 4. Notifier via WebSocket
            await ws_manager.broadcast({
                "type": "NEW_ALERT",
                "alert": {
                    "id": new_alert.id,
                    "person": f"{matched_person.first_name} {matched_person.last_name}",
                    "camera": camera_id,
                    "gravity": new_alert.gravity_level,
                    "photo": new_alert.captured_photo_url
                }
            })
            print(f"CRITICAL MATCH FOUND: {matched_person.first_name} detected!")

    except Exception as e:
        print(f"Error in process_mqtt_alert: {e}")
    finally:
        db.close()

def start_mqtt():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    try:
        client.connect(settings.MQTT_BROKER, settings.MQTT_PORT, 60)
        client.loop_start()
    except Exception as e:
        print(f"Could not connect to MQTT Broker: {e}")

if __name__ == "__main__":
    start_mqtt()
