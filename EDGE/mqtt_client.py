import paho.mqtt.client as mqtt
import json
import time
from config import *

class TogoMQTTClient:
    def __init__(self):
        self.client = mqtt.Client()
        try:
            self.client.connect(MQTT_BROKER, MQTT_PORT, 60)
            self.client.loop_start()
            print(f"Connecté au broker MQTT: {MQTT_BROKER}")
        except Exception as e:
            print(f"Erreur de connexion MQTT: {e}")

    def publish_alert(self, person_id, person_name):
        payload = {
            "camera_id": CAMERA_ID,
            "person_id": person_id,
            "person_name": person_name,
            "timestamp": time.time(),
            "location": {
                "lat": CAMERA_LAT,
                "lng": CAMERA_LNG,
                "address": CAMERA_LOCATION
            },
            "type": "CRITICAL"
        }
        self.client.publish(MQTT_TOPIC_ALERT, json.dumps(payload))

    def publish_heartbeat(self):
        payload = {
            "camera_id": CAMERA_ID,
            "status": "online",
            "timestamp": time.time()
        }
        self.client.publish(MQTT_TOPIC_HEARTBEAT, json.dumps(payload))

    def disconnect(self):
        self.client.loop_stop()
        self.client.disconnect()
