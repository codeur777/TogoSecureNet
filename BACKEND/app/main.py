from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine
from app.models import Base
from app.core.config import settings
from app.api import (
    auth, persons, cameras, alerts, websocket, dashboard, 
    users, audit, portrait_robot, signalements, personnes_disparues,
    engins_voles, detections, alertes
)
from app.mqtt_client import start_mqtt
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Créer les tables si elles n'existent pas
    Base.metadata.create_all(bind=engine)
    # Démarrage du bridge MQTT
    start_mqtt()
    yield
    # Cleanup si besoin

app = FastAPI(title="Togo SecureNet API", version="1.0.0", lifespan=lifespan)

# CORS pour permettre au frontend d'appeler l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir les fichiers média
app.mount("/static", StaticFiles(directory="uploads"), name="static")

# Routes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(signalements.router, prefix="/api/v1/signalements", tags=["Signalements"])
app.include_router(personnes_disparues.router, prefix="/api/v1/personnes-disparues", tags=["Personnes Disparues"])
app.include_router(engins_voles.router, prefix="/api/v1/engins-voles", tags=["Engins Volés"])
app.include_router(detections.router, prefix="/api/v1/detections", tags=["Detections"])
app.include_router(alertes.router, prefix="/api/v1/alertes", tags=["Alertes"])
app.include_router(persons.router, prefix="/api/v1/persons", tags=["Persons (Legacy)"])
app.include_router(cameras.router, prefix="/api/v1/cameras", tags=["Cameras"])
app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["Alerts (Legacy)"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(audit.router, prefix="/api/v1/audit", tags=["Audit"])
app.include_router(portrait_robot.router, prefix="/api/v1/portrait-robot", tags=["Portrait Robot"])
app.include_router(websocket.router, prefix="/ws", tags=["WebSocket"])

@app.get("/")
def root():
    return {"message": "Togo SecureNet API is running"}

@app.get("/health")
def health():
    return {"status": "healthy"}