# Configuration Edge Device
MQTT_BROKER = "localhost"  # IP du serveur central
MQTT_PORT = 1884
MQTT_TOPIC_ALERT = "togo/alert"
MQTT_TOPIC_HEARTBEAT = "togo/camera/heartbeat"

CAMERA_ID = "CAM-001"
CAMERA_LOCATION = "Carrefour Bè, Lomé"
CAMERA_LAT = 6.1375
CAMERA_LNG = 1.2125

# Seuil de reconnaissance faciale (plus petit = plus strict)
FACE_MATCH_TOLERANCE = 0.5

# Fréquence d'analyse (secondes) - 0.2s = 5 fps (plus fluide)
ANALYSIS_INTERVAL = 0.05

# URL de l'API centrale (pour récupérer les signatures faciales)
API_URL = "http://localhost:8000/api/v1"
