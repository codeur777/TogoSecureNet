# 🛡️ TOGO SECURENET — Guide de démarrage et de livraison du projet

> **Système interconnecté de vidéosurveillance intelligente**
> Durée : 12 semaines · Stack : FastAPI · PostgreSQL · React · Flutter · MQTT · IA

---

## 📋 Table des matières

1. [Avant de commencer — Les incontournables](#1-avant-de-commencer--les-incontournables)
2. [Semaine 1–2 — Mise en place de l'infrastructure](#2-semaine-12--mise-en-place-de-linfrastructure)
3. [Semaine 3–5 — Backend API (CRUD & Auth)](#3-semaine-35--backend-api-crud--auth)
4. [Semaine 6–8 — IA & Frontend Admin](#4-semaine-68--ia--frontend-admin)
5. [Semaine 9–10 — Application mobile Police](#5-semaine-910--application-mobile-police)
6. [Semaine 11–12 — Tests, polish & livraison](#6-semaine-1112--tests-polish--livraison)
7. [Checklist de livraison finale](#7-checklist-de-livraison-finale)
8. [Conseils pour un projet en beauté](#8-conseils-pour-un-projet-en-beauté)

---

## 1. Avant de commencer — Les incontournables

Avant d'écrire la moindre ligne de code, prépare ton environnement une bonne fois pour toutes. Ça t'évitera des heures perdues plus tard.

### 1.1 Outils à installer sur ton poste

```bash
# Python 3.11+
python --version  # doit afficher 3.11.x ou plus

# Node.js 18+
node --version

# Flutter SDK (stable channel)
flutter --version   # doit afficher 3.x.x
flutter doctor      # vérifier que tout est OK (Android SDK, etc.)

# Docker & Docker Compose
docker --version
docker compose version

# Git
git --version

# VS Code (recommandé) + extensions utiles :
# - Python (Microsoft)
# - ESLint
# - Tailwind CSS IntelliSense
# - Docker
# - GitLens
# - Flutter (Dart Code)   ← indispensable pour Flutter
# - Dart (Dart Code)
```

### 1.2 Créer le dépôt GitHub dès le Jour 1

```bash
# Crée un repo GitHub nommé "togo-securenet"
git clone https://github.com/TON_USERNAME/togo-securenet.git
cd togo-securenet

# Structure de dossiers à créer immédiatement
mkdir -p backend/app/{api,models,services,schemas,core}
mkdir -p frontend/src/{pages,components,hooks,store}
mkdir -p mobile/lib/{screens,widgets,services,models,providers}
mkdir -p edge/{camera_agent,face_recognition,plate_reader}
mkdir -p infrastructure/{docker,nginx,scripts}
mkdir -p docs/{specs,api,screenshots}

# Fichier README à remplir dès le départ
touch README.md .gitignore .env.example

git add .
git commit -m "chore: initial project structure"
git push
```

### 1.3 Structure `.env.example` à créer

```env
# Base de données
DATABASE_URL=postgresql://securenet:password@localhost:5432/securenet_db
POSTGRES_USER=securenet
POSTGRES_PASSWORD=changeme_in_production
POSTGRES_DB=securenet_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET_KEY=your_super_secret_key_here
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60

# MQTT (EMQX)
MQTT_BROKER_HOST=localhost
MQTT_BROKER_PORT=1883
MQTT_USERNAME=securenet
MQTT_PASSWORD=changeme

# IA
FACE_RECOGNITION_THRESHOLD=0.85
PLATE_RECOGNITION_THRESHOLD=0.80

# Notifications
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# App
APP_ENV=development
APP_HOST=0.0.0.0
APP_PORT=8000
```

### 1.4 Convention de commit à adopter

Utilise le format **Conventional Commits** pour un historique propre :

```
feat: ajout de la reconnaissance faciale
fix: correction du bug de déconnexion WebSocket
chore: mise à jour des dépendances Python
docs: ajout de la documentation API
test: ajout des tests unitaires sur le service alertes
refactor: découpage du service alert en sous-modules
```

---

## 2. Semaine 1–2 — Mise en place de l'infrastructure

> **Objectif :** Tout le monde peut lancer le projet en une commande. L'infra tourne, les bases sont vides mais fonctionnelles.

### 2.1 `docker-compose.yml` de développement

Crée le fichier `infrastructure/docker/docker-compose.dev.yml` :

```yaml
version: '3.9'

services:
  postgres:
    image: pgvector/pgvector:pg15
    container_name: securenet_postgres
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: securenet_redis
    ports:
      - "6379:6379"
    command: redis-server --requirepass ${REDIS_PASSWORD:-changeme}

  emqx:
    image: emqx:5.0
    container_name: securenet_mqtt
    ports:
      - "1883:1883"   # MQTT TCP
      - "8083:8083"   # MQTT WebSocket
      - "18083:18083" # Dashboard EMQX
    environment:
      EMQX_DASHBOARD__DEFAULT_USERNAME: admin
      EMQX_DASHBOARD__DEFAULT_PASSWORD: changeme
    volumes:
      - emqx_data:/opt/emqx/data

  backend:
    build:
      context: ../../backend
      dockerfile: Dockerfile.dev
    container_name: securenet_api
    ports:
      - "8000:8000"
    env_file:
      - ../../.env
    volumes:
      - ../../backend:/app
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

volumes:
  postgres_data:
  emqx_data:
```

### 2.2 Script d'initialisation de la base (`init.sql`)

```sql
-- Activer l'extension pgvector
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Les tables sont créées par Alembic (migrations)
-- Ce fichier sert uniquement aux extensions
```

### 2.3 Backend FastAPI — Structure minimale

```
backend/
├── app/
│   ├── main.py           ← point d'entrée
│   ├── core/
│   │   ├── config.py     ← lecture des variables d'environnement
│   │   ├── database.py   ← connexion SQLAlchemy
│   │   ├── security.py   ← JWT helpers
│   │   └── redis.py      ← client Redis
│   ├── models/           ← modèles SQLAlchemy (tables)
│   ├── schemas/          ← modèles Pydantic (validation)
│   ├── api/
│   │   ├── v1/
│   │   │   ├── auth.py
│   │   │   ├── persons.py
│   │   │   ├── alerts.py
│   │   │   ├── cameras.py
│   │   │   └── vehicles.py
│   │   └── websocket.py
│   └── services/
│       ├── face_service.py
│       ├── alert_service.py
│       └── mqtt_service.py
├── migrations/           ← Alembic
├── tests/
├── requirements.txt
└── Dockerfile.dev
```

**`backend/app/main.py`** (point de départ) :

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import auth, persons, alerts, cameras, vehicles
from app.api import websocket

app = FastAPI(
    title="Togo SecureNet API",
    description="Système de surveillance intelligente pour le Togo",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentification"])
app.include_router(persons.router, prefix="/api/v1/persons", tags=["Personnes disparues"])
app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["Alertes"])
app.include_router(cameras.router, prefix="/api/v1/cameras", tags=["Caméras"])
app.include_router(vehicles.router, prefix="/api/v1/vehicles", tags=["Véhicules volés"])
app.include_router(websocket.router, prefix="/ws", tags=["WebSocket"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "Togo SecureNet"}
```

### ✅ Critère de validation S1–S2

- [ ] `docker compose up` lance postgres, redis, emqx et le backend sans erreur
- [ ] `http://localhost:8000/health` répond `{"status": "ok"}`
- [ ] `http://localhost:8000/api/docs` affiche la documentation Swagger
- [ ] La base de données est créée avec toutes les tables (via `alembic upgrade head`)
- [ ] Le dashboard EMQX est accessible sur `http://localhost:18083`
- [ ] Premier commit poussé sur GitHub avec la structure complète

---

## 3. Semaine 3–5 — Backend API (CRUD & Auth)

> **Objectif :** Toutes les routes REST sont fonctionnelles et testables via Swagger. L'authentification JWT est en place.

### 3.1 Ordre de développement des routes

Développe dans cet ordre — chaque module débloque le suivant :

```
1. Auth (POST /login, POST /refresh, GET /me)
      ↓
2. Users (CRUD — super_admin uniquement)
      ↓
3. Cameras (CRUD + heartbeat endpoint)
      ↓
4. Persons (CRUD + upload photos)
      ↓
5. Vehicles (CRUD)
      ↓
6. Alerts (GET list, GET detail, PATCH validate/reject)
      ↓
7. WebSocket (/ws/alerts — push temps réel)
```

### 3.2 Pattern de route à respecter (exemple : Persons)

```python
# backend/app/api/v1/persons.py

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import List
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.person import PersonCreate, PersonResponse, PersonUpdate
from app.services.person_service import PersonService

router = APIRouter()

@router.post("/", response_model=PersonResponse, status_code=201)
async def create_person(
    person_data: PersonCreate,
    photos: List[UploadFile] = File(..., min_length=3),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """
    Enregistrer une personne disparue avec minimum 3 photos.
    Déclenche l'extraction automatique des embeddings faciaux.
    """
    if len(photos) < 3:
        raise HTTPException(status_code=422, detail="Minimum 3 photos requises")
    return await PersonService.create(db, person_data, photos, current_user.id)


@router.get("/", response_model=List[PersonResponse])
async def list_persons(
    status: str = "missing",
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Lister les personnes disparues avec filtres."""
    return PersonService.get_all(db, status=status, skip=skip, limit=limit)


@router.get("/{person_id}", response_model=PersonResponse)
async def get_person(
    person_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    person = PersonService.get_by_id(db, person_id)
    if not person:
        raise HTTPException(status_code=404, detail="Personne non trouvée")
    return person
```

### 3.3 Tests à écrire au fur et à mesure

```python
# backend/tests/test_persons.py

def test_create_person_requires_3_photos(client, auth_headers):
    """Doit rejeter si moins de 3 photos."""
    response = client.post(
        "/api/v1/persons/",
        data={"first_name": "Test", "last_name": "User", "gravity_level": "low"},
        files=[("photos", ("photo1.jpg", b"...", "image/jpeg"))],  # 1 seule photo
        headers=auth_headers,
    )
    assert response.status_code == 422

def test_create_person_success(client, auth_headers, sample_photos):
    """Doit créer une personne avec 3 photos."""
    response = client.post(
        "/api/v1/persons/",
        data={"first_name": "Kofi", "last_name": "Mensah", "gravity_level": "high"},
        files=sample_photos,
        headers=auth_headers,
    )
    assert response.status_code == 201
    assert response.json()["id"] is not None
```

### ✅ Critère de validation S3–S5

- [ ] `POST /api/v1/auth/login` retourne un JWT valide
- [ ] Toutes les routes CRUD (persons, cameras, vehicles, alerts) fonctionnent via Swagger
- [ ] Un utilisateur non authentifié reçoit une erreur 401
- [ ] Les données sont bien persistées en base (vérifier avec `psql` ou DBeaver)
- [ ] Au moins 5 tests unitaires passent (`pytest` vert)

---

## 4. Semaine 6–8 — IA & Frontend Admin

> **Objectif :** La reconnaissance faciale fonctionne sur webcam. Le dashboard React affiche les alertes en temps réel.

### 4.1 Script Edge (agent caméra)

```python
# edge/camera_agent/agent.py

import cv2
import face_recognition
import numpy as np
import paho.mqtt.client as mqtt
import base64
import json
import time
from datetime import datetime

class CameraAgent:
    def __init__(self, camera_id: str, rtsp_url: str, server_url: str):
        self.camera_id = camera_id
        self.rtsp_url = rtsp_url
        self.known_embeddings = []  # chargés depuis l'API
        self.mqtt_client = self._setup_mqtt()

    def _setup_mqtt(self):
        client = mqtt.Client(client_id=f"camera_{self.camera_id}")
        client.connect("localhost", 1883)
        return client

    def load_embeddings_from_api(self):
        """Charge les embeddings des personnes disparues depuis l'API."""
        import requests
        resp = requests.get(f"http://localhost:8000/api/v1/persons/embeddings")
        self.known_embeddings = resp.json()
        print(f"[{self.camera_id}] {len(self.known_embeddings)} embeddings chargés")

    def process_frame(self, frame):
        """Analyse une frame et publie une alerte si match."""
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        locations = face_recognition.face_locations(rgb)
        encodings = face_recognition.face_encodings(rgb, locations)

        for encoding, location in zip(encodings, locations):
            for known in self.known_embeddings:
                distance = face_recognition.face_distance(
                    [np.array(known["embedding"])], encoding
                )[0]
                confidence = 1 - distance

                if confidence >= 0.85:
                    self._publish_alert(known["person_id"], confidence, frame, location)

    def _publish_alert(self, person_id, confidence, frame, location):
        top, right, bottom, left = location
        face_img = frame[top:bottom, left:right]
        _, buffer = cv2.imencode('.jpg', face_img)
        photo_b64 = base64.b64encode(buffer).decode()

        payload = {
            "person_id": person_id,
            "camera_id": self.camera_id,
            "confidence": round(float(confidence), 4),
            "captured_photo": photo_b64,
            "timestamp": datetime.utcnow().isoformat(),
        }
        topic = f"togo/camera/{self.camera_id}/alert"
        self.mqtt_client.publish(topic, json.dumps(payload))
        print(f"[ALERT] Person {person_id} détectée avec {confidence:.1%} de confiance")

    def run(self):
        self.load_embeddings_from_api()
        cap = cv2.VideoCapture(self.rtsp_url)
        print(f"[{self.camera_id}] Surveillance démarrée...")

        while True:
            ret, frame = cap.read()
            if not ret:
                print(f"[{self.camera_id}] Erreur lecture flux vidéo")
                time.sleep(5)
                continue

            self.process_frame(frame)

            # Heartbeat toutes les 30 secondes
            self.mqtt_client.publish(
                f"togo/camera/{self.camera_id}/heartbeat",
                json.dumps({"status": "online", "ts": time.time()})
            )
            time.sleep(1)  # 1 frame par seconde
```

### 4.2 Frontend React — Pages à développer dans l'ordre

```
1. /login               ← page d'authentification
2. /dashboard           ← carte Togo + stats + dernières alertes
3. /alerts              ← liste avec filtres + boutons Valider/Rejeter
4. /persons             ← liste + formulaire ajout (upload 3 photos)
5. /cameras             ← liste + formulaire + statut heartbeat
6. /vehicles            ← liste + formulaire motos volées
7. /users               ← gestion des comptes (super_admin only)
8. /stats               ← graphiques recharts
```

### 4.3 Hook WebSocket à réutiliser partout

```typescript
// frontend/src/hooks/useAlertWebSocket.ts

import { useEffect, useRef, useState } from 'react';
import { Alert } from '../types';

export function useAlertWebSocket() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [connected, setConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    ws.current = new WebSocket(`ws://localhost:8000/ws/alerts?token=${token}`);

    ws.current.onopen = () => {
      console.log('[WS] Connecté au serveur d\'alertes');
      setConnected(true);
    };

    ws.current.onmessage = (event) => {
      const alert: Alert = JSON.parse(event.data);
      setAlerts(prev => [alert, ...prev].slice(0, 100)); // garder les 100 dernières

      // Son d'alerte pour les niveaux critiques
      if (alert.gravity_level === 'critical') {
        new Audio('/sounds/critical_alert.mp3').play();
      }
    };

    ws.current.onclose = () => setConnected(false);

    return () => ws.current?.close();
  }, []);

  return { alerts, connected };
}
```

### ✅ Critère de validation S6–S8

- [ ] Le script Edge détecte un visage depuis la webcam et publie sur MQTT
- [ ] Le backend consomme le topic MQTT et crée une alerte en base
- [ ] L'alerte apparaît sur le dashboard en temps réel (< 2 secondes)
- [ ] La carte Leaflet affiche les caméras avec leur statut (vert/rouge)
- [ ] Le formulaire d'ajout de personne avec 3 photos fonctionne
- [ ] Les boutons Valider/Rejeter changent le statut de l'alerte

---

## 5. Semaine 9–10 — Application mobile Police

> **Objectif :** Un policier peut recevoir une notification push, voir le détail de l'alerte et confirmer son intervention.

### 5.1 Initialisation du projet Flutter

```bash
cd mobile
flutter create . --org tg.securenet --project-name securenet_police
flutter pub add \
  http \
  dio \
  provider \
  go_router \
  flutter_local_notifications \
  firebase_messaging \
  firebase_core \
  google_maps_flutter \
  web_socket_channel \
  shared_preferences \
  flutter_secure_storage \
  cached_network_image \
  intl

# Vérifier que tout compile
flutter run
```

### 5.2 Structure de l'app Flutter

```
mobile/
├── lib/
│   ├── main.dart                  ← point d'entrée
│   ├── app.dart                   ← MaterialApp + GoRouter
│   ├── screens/
│   │   ├── login_screen.dart
│   │   ├── alert_list_screen.dart
│   │   ├── alert_detail_screen.dart
│   │   └── profile_screen.dart
│   ├── widgets/
│   │   ├── alert_card.dart        ← carte alerte avec couleur selon gravité
│   │   ├── photo_comparison.dart  ← photo capturée VS référence côte à côte
│   │   └── gravity_badge.dart     ← badge VERT / ORANGE / ROUGE
│   ├── services/
│   │   ├── api_service.dart       ← Dio + JWT interceptor
│   │   ├── notification_service.dart ← FCM + local notifications
│   │   └── websocket_service.dart ← écoute alertes temps réel
│   ├── providers/
│   │   ├── auth_provider.dart     ← état connexion
│   │   └── alert_provider.dart    ← liste alertes + filtres
│   └── models/
│       ├── alert.dart
│       ├── person.dart
│       └── user.dart
├── android/
├── ios/
├── pubspec.yaml
└── README.md
```

### 5.3 Service API avec Dio (JWT interceptor)

```dart
// lib/services/api_service.dart

import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  static const String baseUrl = 'http://YOUR_SERVER:8000/api/v1';
  late final Dio _dio;
  final _storage = const FlutterSecureStorage();

  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
    ));

    // Intercepteur : ajoute le JWT à chaque requête
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: 'access_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) async {
        // Token expiré → refresh automatique
        if (error.response?.statusCode == 401) {
          await _refreshToken();
          return handler.resolve(await _retry(error.requestOptions));
        }
        return handler.next(error);
      },
    ));
  }

  Future<List<Map<String, dynamic>>> getAlerts({String? status}) async {
    final resp = await _dio.get('/alerts', queryParameters: {'status': status});
    return List<Map<String, dynamic>>.from(resp.data);
  }

  Future<void> confirmIntervention(String alertId) async {
    await _dio.patch('/alerts/$alertId', data: {'status': 'resolved'});
  }

  Future<void> _refreshToken() async {
    final refresh = await _storage.read(key: 'refresh_token');
    final resp = await _dio.post('/auth/refresh', data: {'refresh_token': refresh});
    await _storage.write(key: 'access_token', value: resp.data['access_token']);
  }

  Future<Response> _retry(RequestOptions opts) async {
    return _dio.request(opts.path,
        data: opts.data,
        queryParameters: opts.queryParameters,
        options: Options(method: opts.method, headers: opts.headers));
  }
}
```

### 5.4 Service WebSocket pour alertes temps réel

```dart
// lib/services/websocket_service.dart

import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import '../models/alert.dart';

class WebSocketService {
  WebSocketChannel? _channel;
  final void Function(Alert alert) onAlertReceived;

  WebSocketService({required this.onAlertReceived});

  void connect(String token) {
    _channel = WebSocketChannel.connect(
      Uri.parse('ws://YOUR_SERVER:8000/ws/alerts?token=$token'),
    );

    _channel!.stream.listen(
      (data) {
        final json = jsonDecode(data as String);
        final alert = Alert.fromJson(json);
        onAlertReceived(alert);
      },
      onError: (err) {
        // Reconnexion automatique après 5 secondes
        Future.delayed(const Duration(seconds: 5), () => connect(token));
      },
    );
  }

  void disconnect() => _channel?.sink.close();
}
```

### 5.5 Configuration des notifications push (FCM)

```dart
// lib/services/notification_service.dart

import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class NotificationService {
  final FlutterLocalNotificationsPlugin _local = FlutterLocalNotificationsPlugin();

  Future<void> initialize() async {
    // Initialisation locale
    const settings = InitializationSettings(
      android: AndroidInitializationSettings('@mipmap/ic_launcher'),
      iOS: DarwinInitializationSettings(),
    );
    await _local.initialize(settings);

    // FCM — demande de permissions
    await FirebaseMessaging.instance.requestPermission(alert: true, badge: true, sound: true);

    // Récupérer le token FCM et l'envoyer au backend
    final fcmToken = await FirebaseMessaging.instance.getToken();
    if (fcmToken != null) await _sendTokenToServer(fcmToken);

    // Écoute des messages en foreground
    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);
  }

  void _handleForegroundMessage(RemoteMessage message) {
    final gravity = message.data['gravity_level'] ?? 'low';
    final isCritical = gravity == 'critical';

    _local.show(
      DateTime.now().millisecondsSinceEpoch ~/ 1000,
      isCritical ? '🚨 ALERTE ROUGE — Intervention requise' : '⚠️ Nouvelle alerte',
      message.notification?.body ?? 'Personne signalée détectée',
      NotificationDetails(
        android: AndroidNotificationDetails(
          isCritical ? 'critical_alerts' : 'normal_alerts',
          isCritical ? 'Alertes critiques' : 'Alertes normales',
          importance: isCritical ? Importance.max : Importance.high,
          priority: isCritical ? Priority.max : Priority.high,
          playSound: true,
          // Son personnalisé pour les alertes rouges
          sound: isCritical
              ? const RawResourceAndroidNotificationSound('critical_alert')
              : null,
        ),
      ),
    );
  }

  Future<void> _sendTokenToServer(String token) async {
    // Appel ApiService.registerPushToken(token)
  }
}
```

### 5.6 Widget AlertCard (couleur selon gravité)

```dart
// lib/widgets/alert_card.dart

import 'package:flutter/material.dart';
import '../models/alert.dart';

class AlertCard extends StatelessWidget {
  final Alert alert;
  final VoidCallback onTap;

  const AlertCard({super.key, required this.alert, required this.onTap});

  Color get _borderColor {
    switch (alert.gravityLevel) {
      case 'critical': return Colors.red.shade700;
      case 'high':     return Colors.orange.shade600;
      default:         return Colors.green.shade600;
    }
  }

  String get _gravityLabel {
    switch (alert.gravityLevel) {
      case 'critical': return '🔴 TRÈS GRAVE';
      case 'high':     return '🟠 GRAVE';
      default:         return '🟢 PAS GRAVE';
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: _borderColor, width: 2),
          boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)],
        ),
        child: ListTile(
          leading: ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Image.network(
              alert.capturedPhotoUrl,
              width: 56, height: 56, fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => const Icon(Icons.person, size: 56),
            ),
          ),
          title: Text(
            alert.personName,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(_gravityLabel),
              Text(alert.cameraName, style: const TextStyle(fontSize: 12)),
            ],
          ),
          trailing: Text(
            '${(alert.confidence * 100).toStringAsFixed(0)}%',
            style: TextStyle(
              color: _borderColor,
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
        ),
      ),
    );
  }
}
```

### ✅ Critère de validation S9–S10

- [ ] `flutter run` lance l'app sur un émulateur Android ou un vrai téléphone
- [ ] L'app se connecte et affiche la liste des alertes triées par gravité (rouge en tête)
- [ ] `AlertCard` affiche la bonne couleur de bordure selon le niveau
- [ ] Le détail affiche les deux photos côte à côte (capturée vs référence)
- [ ] Le bouton "Confirmer intervention" appelle `PATCH /alerts/{id}` et met à jour l'UI
- [ ] Une notification push FCM s'affiche quand une alerte niveau rouge arrive (tester avec Firebase Console)
- [ ] Le WebSocket reçoit les nouvelles alertes sans relancer l'app

---

## 6. Semaine 11–12 — Tests, polish & livraison

> **Objectif :** Le projet est prêt à être démontré. Tout est documenté, testé et emballé proprement.

### 6.1 Tests à compléter

```bash
# Backend — viser 60% de couverture minimum
cd backend
pytest --cov=app --cov-report=html tests/
# Ouvrir htmlcov/index.html pour visualiser

# Tests critiques à ne pas louper :
# - test_auth_flow (login → token → route protégée)
# - test_alert_routing (alerte rouge → pas de validation requise)
# - test_face_matching (embedding proche → alerte créée)
# - test_anti_spam (même personne/caméra dans les 5 min → ignorée)
# - test_websocket_broadcast (alerte créée → reçue côté client WS)
```

### 6.2 Scénario de démo à préparer

Prépare un scénario béton pour ton maître de stage. Script chronométré :

```
DÉMO TOGO SECURENET — Scénario de présentation (15 minutes)

[00:00 - 02:00] Introduction
  → Ouvrir le dashboard admin
  → Montrer la carte du Togo avec les caméras actives

[02:00 - 05:00] Enregistrement d'une personne disparue
  → Cliquer "Nouvelle personne"
  → Saisir les infos (nom, âge, gravité : ROUGE)
  → Uploader 3 photos
  → Valider → confirmation avec ID généré

[05:00 - 08:00] Détection en direct
  → Lancer le script Edge (webcam)
  → Placer la photo de la personne devant la webcam
  → Le dashboard affiche l'alerte en temps réel (< 2s)
  → L'alerte arrive sur l'app mobile police simultanément

[08:00 - 10:00] Gestion des alertes
  → Alerte orange → admin valide → notification envoyée à la police
  → Alerte rouge → dispatch automatique (pas de validation)
  → Montrer les boutons Valider / Rejeter

[10:00 - 12:00] Motos volées
  → Enregistrer une plaque de moto
  → Simuler une détection de plaque par OCR
  → L'alerte arrive avec la plaque reconnue

[12:00 - 15:00] Administration
  → Ajouter une caméra (nom, coordonnées, URL RTSP)
  → Voir le statut heartbeat (vert = en ligne)
  → Montrer les logs d'audit (qui a fait quoi)
  → Statistiques : graphique des alertes par jour
```

### 6.3 Documentation à livrer

```
docs/
├── README.md                    ← déjà fait (voir section 8.4)
├── api/
│   └── openapi.json            ← export depuis /api/docs
├── specs/
│   └── cahier_des_charges.md   ← fourni
├── screenshots/
│   ├── dashboard.png
│   ├── alert_detail.png
│   ├── mobile_app.png
│   └── edge_detection.png
└── rapport_de_stage/
    └── rapport.md              ← à rédiger en S11
```

### 6.4 README.md final du projet

```markdown
# 🛡️ Togo SecureNet

Système interconnecté de vidéosurveillance intelligente pour la recherche 
de personnes disparues et d'engins volés au Togo.

## Démarrage rapide

```bash
git clone https://github.com/TON_USERNAME/togo-securenet.git
cd togo-securenet
cp .env.example .env
docker compose -f infrastructure/docker/docker-compose.dev.yml up -d
cd backend && alembic upgrade head
```

## Accès

| Service | URL | Identifiants |
|---------|-----|--------------|
| API Docs | http://localhost:8000/api/docs | — |
| Dashboard Admin | http://localhost:5173 | admin@securenet.tg / admin123 |
| EMQX Dashboard | http://localhost:18083 | admin / changeme |

## Architecture

FastAPI · PostgreSQL + pgvector · Redis · EMQX · React · Flutter · OpenCV

## Auteur

[Ton nom] — Stage Génie Logiciel 3ème année, [Année]
```

### ✅ Critère de validation S11–S12

- [ ] `docker compose up` lance tout le projet en une commande
- [ ] Le scénario de démo se déroule sans erreur
- [ ] La documentation API est exportée (openapi.json)
- [ ] Les screenshots sont dans `docs/screenshots/`
- [ ] Le rapport de stage est en cours de rédaction
- [ ] Le code est taggué `v1.0.0` sur GitHub (`git tag v1.0.0 && git push --tags`)

---

## 7. Checklist de livraison finale

### Code & Qualité
- [ ] Aucune clé API ou mot de passe en dur dans le code (utiliser `.env`)
- [ ] Le `.gitignore` exclut `.env`, `__pycache__`, `node_modules`, `*.pyc`, `.dart_tool/`, `build/`
- [ ] Les variables d'environnement sensibles sont dans `.env.example` (sans valeurs réelles)
- [ ] Le code est commenté sur les parties complexes (services IA notamment)
- [ ] Pas de `console.log()` ou `print()` de debug oubliés

### Fonctionnel
- [ ] Authentification JWT fonctionne (login / logout / refresh)
- [ ] CRUD complet : personnes, caméras, véhicules, utilisateurs
- [ ] Reconnaissance faciale : détection + matching + alerte
- [ ] OCR plaques : détection + matching + alerte
- [ ] Système d'alertes 3 niveaux avec routing correct
- [ ] WebSocket temps réel (< 2s sur le dashboard)
- [ ] Notification push sur mobile (< 5s)
- [ ] Anti-spam fonctionne (même personne/caméra ignorée 5 min)
- [ ] Accès distant caméras via tunnel sécurisé
- [ ] Audit trail : toutes les actions admin sont loguées

### Documentation
- [ ] README.md complet avec instructions de démarrage
- [ ] Documentation API Swagger accessible et à jour
- [ ] Rapport de stage rédigé
- [ ] Captures d'écran de toutes les interfaces

### Présentation
- [ ] Scénario de démo préparé et répété
- [ ] Données de test pré-chargées (2-3 personnes, 3 caméras, historique d'alertes)
- [ ] Script Edge prêt à lancer avec une webcam
- [ ] Slides de présentation (optionnel mais recommandé)

---

## 8. Conseils pour un projet en beauté

### Ce qui impressionne un maître de stage

1. **La démo marche du premier coup.** Prépare des données de test, teste le scénario 10 fois la veille. Ne fais jamais une démo sur une machine non testée.

2. **Le README suffit à installer le projet.** Si quelqu'un clone ton repo et suit le README sans te demander d'aide, c'est une victoire.

3. **Les erreurs sont gérées proprement.** Un message d'erreur clair vaut mieux qu'un crash silencieux. Montre que tu as pensé aux cas limites.

4. **Le code est lisible.** Des noms de variables clairs, des fonctions courtes (< 30 lignes), des commentaires sur le "pourquoi" pas le "quoi".

5. **Tu sais expliquer tes choix.** Pourquoi FastAPI et pas Django ? Pourquoi Flutter et pas React Native ? (Flutter = un seul codebase Dart, performances natives, excellent sur Android qui est dominant au Togo) Prépare tes réponses.

### Pièges à éviter absolument

- ❌ Committer `.env` avec de vraies clés — vérifie deux fois avant chaque `git push`
- ❌ Ignorer les performances de l'IA en production — teste avec 50+ personnes en base
- ❌ Oublier la gestion des erreurs réseau dans l'app Flutter (utiliser try/catch sur tous les appels Dio)
- ❌ Laisser des routes non protégées (tester chaque endpoint sans token)
- ❌ Négliger les index PostgreSQL — sans eux, la recherche d'embeddings sera lente

### Ce à faire dès maintenant (Jour 1)

```
✅ Créer le repo GitHub
✅ Copier ce guide dans ton projet (docs/GUIDE_DEVELOPPEMENT.md)
✅ Faire le premier docker compose up
✅ Envoyer un premier commit
✅ Partager le lien GitHub avec ton maître de stage
```

---

*Document rédigé pour le projet Togo SecureNet — v1.0 · 2025*
*Ce guide est vivant : mets-le à jour au fil du projet.*
