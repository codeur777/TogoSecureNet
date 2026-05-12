<p align="center">
  <img src="https://img.shields.io/badge/🇹🇬_Togo-SecureNet-00853F?style=for-the-badge&labelColor=FFD100" alt="Togo SecureNet"/>
</p>

<h1 align="center">🛡️ Togo SecureNet</h1>

<p align="center">
  <strong>Plateforme intelligente de vidéosurveillance et de reconnaissance faciale pour la sécurité publique au Togo</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Flutter-02569B?style=flat-square&logo=flutter&logoColor=white" alt="Flutter"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis"/>
  <img src="https://img.shields.io/badge/MQTT-660066?style=flat-square&logo=mqtt&logoColor=white" alt="MQTT"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python"/>
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/codeur777/TogoSecureNet?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/github/last-commit/codeur777/TogoSecureNet?style=flat-square" alt="Last Commit"/>
</p>

---

## 📋 Table des matières

- [Présentation](#-présentation)
- [Architecture](#-architecture)
- [Technologies](#-technologies)
- [Structure du projet](#-structure-du-projet)
- [Prérequis](#-prérequis)
- [Installation & Démarrage](#-installation--démarrage)
- [Configuration](#-configuration)
- [Fonctionnalités](#-fonctionnalités)
- [API Documentation](#-api-documentation)
- [Contributeurs](#-contributeurs)
- [Licence](#-licence)

---

## 🎯 Présentation

**Togo SecureNet** est une plateforme de sécurité urbaine conçue pour le **Togo**, intégrant la vidéosurveillance intelligente et la reconnaissance faciale en temps réel. Le système permet aux forces de l'ordre et aux autorités de :

- 🎥 **Surveiller** les flux vidéo en temps réel depuis un réseau de caméras
- 🧠 **Détecter automatiquement** les visages via l'intelligence artificielle (Edge Computing)
- 🔔 **Recevoir des alertes instantanées** lors de la reconnaissance d'une personne recherchée
- 📊 **Analyser les statistiques** de sécurité à travers un tableau de bord interactif
- 📱 **Intervenir rapidement** grâce aux notifications mobiles géolocalisées

> 🎓 *Projet de soutenance — Licence Professionnelle*

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        TOGO SECURENET                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────────┐   │
│  │  📱 Mobile   │     │  🖥️ Web      │     │  🎥 Edge Device  │   │
│  │  Flutter     │     │  React/Vite │     │  Python/OpenCV  │   │
│  └──────┬──────┘     └──────┬──────┘     └────────┬────────┘   │
│         │                   │                      │            │
│         │    REST API       │    REST API           │  MQTT      │
│         │                   │                      │            │
│  ┌──────┴───────────────────┴──────────────────────┴────────┐   │
│  │                  🚀 Backend FastAPI                       │   │
│  │  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌────────┐  │   │
│  │  │  Auth    │  │  Alertes  │  │ Caméras  │  │ Recon. │  │   │
│  │  │  JWT     │  │  CRUD     │  │  CRUD    │  │ Faciale│  │   │
│  │  └──────────┘  └───────────┘  └──────────┘  └────────┘  │   │
│  └──────┬──────────────┬──────────────┬─────────────────────┘   │
│         │              │              │                          │
│  ┌──────┴──────┐ ┌─────┴─────┐ ┌─────┴─────┐                   │
│  │ 🐘 Postgres │ │ 🔴 Redis  │ │ 📡 EMQX   │                   │
│  │  + pgvector │ │  Cache    │ │  MQTT     │                   │
│  └─────────────┘ └───────────┘ └───────────┘                   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technologies

| Composant | Technologie | Rôle |
|-----------|------------|------|
| **Backend** | FastAPI + SQLAlchemy + Alembic | API REST, logique métier, migrations |
| **Frontend Web** | React 19 + Vite + TailwindCSS | Dashboard de surveillance |
| **Frontend Mobile** | Flutter (Dart) | Application agents terrain |
| **Base de données** | PostgreSQL 14 + pgvector | Stockage + vecteurs faciaux |
| **Cache** | Redis 7 | Cache, sessions, pub/sub |
| **Broker MQTT** | EMQX | Communication IoT temps réel |
| **Edge Computing** | Python + OpenCV + face_recognition | Détection & reconnaissance faciale |
| **Cartographie** | Leaflet + React-Leaflet | Visualisation géographique |
| **Graphiques** | Recharts | Statistiques et analytics |
| **Conteneurisation** | Docker + Docker Compose | Déploiement unifié |

---

## 📂 Structure du projet

```
TogoSecureNet/
│
├── 📁 BACKEND/                    # API FastAPI
│   ├── app/
│   │   ├── api/                   # Routes (auth, alertes, caméras, personnes)
│   │   ├── core/                  # Sécurité, hashing, JWT
│   │   ├── models/                # Modèles SQLAlchemy (ORM)
│   │   ├── schemas/               # Schémas Pydantic (validation)
│   │   ├── services/              # Logique métier (reconnaissance faciale)
│   │   ├── utils/                 # Utilitaires
│   │   ├── config.py              # Configuration centralisée
│   │   ├── database.py            # Connexion PostgreSQL
│   │   ├── main.py                # Point d'entrée FastAPI
│   │   ├── mqtt_client.py         # Client MQTT (réception alertes Edge)
│   │   └── redis_client.py        # Client Redis
│   ├── migrations/                # Migrations Alembic
│   ├── Dockerfile
│   ├── requirements.txt
│   └── seed_db.py                 # Données de test
│
├── 📁 FRONTEND_WEB/               # Dashboard React
│   └── frontend/
│       ├── src/
│       │   ├── components/        # Composants réutilisables
│       │   │   ├── Alerts/        # Cartes & modales d'alertes
│       │   │   ├── Auth/          # Route protégée
│       │   │   ├── Cameras/       # Gestion des caméras
│       │   │   ├── Dashboard/     # Stats, carte, liste alertes
│       │   │   ├── Layout/        # Header, Sidebar, Layout
│       │   │   └── Persons/       # Gestion des personnes recherchées
│       │   ├── contexts/          # AuthContext (JWT)
│       │   ├── hooks/             # useAlerts, useAuth, useWebSocket
│       │   ├── pages/             # Dashboard, Alerts, Cameras, Persons, Stats
│       │   └── services/          # API, MQTT, WebSocket clients
│       ├── Dockerfile
│       └── package.json
│
├── 📁 FRONTEND_MOBILE/            # App Flutter
│   └── togosecurenet/
│       └── lib/
│           ├── models/            # Modèle Alert
│           ├── screens/           # Écran Dashboard
│           └── services/          # Service API
│
├── 📁 EDGE/                       # Simulateur Edge Device
│   ├── camera_simulator.py        # Simulation flux caméra
│   ├── face_detector.py           # Détection faciale (OpenCV)
│   ├── mqtt_client.py             # Publication alertes via MQTT
│   ├── simulator.py               # Orchestrateur Edge
│   ├── config.py                  # Configuration (broker, caméra, seuils)
│   └── requirements.txt
│
├── 📄 docker-compose.yml          # Orchestration complète
├── 📄 cahier_de_charge.md         # Cahier des charges du projet
├── 📄 GUIDE_PROJET_TOGO_SECURENET.md
├── 📄 .gitignore
└── 📄 README.md                   # ← Vous êtes ici
```

---

## ✅ Prérequis

- **Docker** & **Docker Compose** (v2+)
- **Node.js** 18+ & **npm** (pour le développement frontend)
- **Python** 3.10+ (pour le développement backend/edge)
- **Flutter** 3.x (pour le développement mobile)
- **Git**

---

## 🚀 Installation & Démarrage

### 1. Cloner le dépôt

```bash
git clone https://github.com/codeur777/TogoSecureNet.git
cd TogoSecureNet
```

### 2. Démarrage rapide avec Docker (recommandé)

```bash
# Lancer tous les services
docker-compose up -d --build

# Vérifier que tout tourne
docker-compose ps
```

Cela démarre automatiquement :

| Service | URL | Description |
|---------|-----|-------------|
| **Backend API** | http://localhost:8000 | API FastAPI + Swagger |
| **Frontend Web** | http://localhost:5173 | Dashboard React |
| **PostgreSQL** | localhost:5433 | Base de données |
| **Redis** | localhost:6379 | Cache |
| **EMQX Dashboard** | http://localhost:18084 | Broker MQTT |
| **EMQX MQTT** | localhost:1884 | Port MQTT |

### 3. Développement local (sans Docker)

<details>
<summary><strong>🔧 Backend</strong></summary>

```bash
cd BACKEND

# Créer l'environnement virtuel
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

# Installer les dépendances
pip install -r requirements.txt

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos paramètres

# Lancer le serveur
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
</details>

<details>
<summary><strong>🖥️ Frontend Web</strong></summary>

```bash
cd FRONTEND_WEB/frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```
</details>

<details>
<summary><strong>📱 Frontend Mobile</strong></summary>

```bash
cd FRONTEND_MOBILE/togosecurenet

# Récupérer les dépendances
flutter pub get

# Lancer sur un appareil/émulateur
flutter run
```
</details>

<details>
<summary><strong>🎥 Edge Simulator</strong></summary>

```bash
cd EDGE

# Installer les dépendances
pip install -r requirements.txt

# Lancer le simulateur
python simulator.py
```
</details>

---

## ⚙️ Configuration

### Variables d'environnement Backend

| Variable | Description | Défaut |
|----------|-------------|--------|
| `DATABASE_URL` | URL PostgreSQL | `postgresql://admin:postgres@postgres:5432/togo_securenet` |
| `REDIS_URL` | URL Redis | `redis://redis:6379` |
| `MQTT_BROKER` | Hôte du broker MQTT | `emqx` |
| `MQTT_PORT` | Port MQTT | `1883` |
| `SECRET_KEY` | Clé secrète JWT | — |
| `ALGORITHM` | Algorithme JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Durée token | `30` |
| `ADMIN_EMAIL` | Email admin par défaut | `admin@togosecurenet.tg` |
| `ADMIN_PASSWORD` | Mot de passe admin | `admin123` |

### Configuration Edge Device (`EDGE/config.py`)

| Paramètre | Description | Défaut |
|-----------|-------------|--------|
| `CAMERA_ID` | Identifiant de la caméra | `CAM-001` |
| `CAMERA_LOCATION` | Localisation textuelle | `Carrefour Bè, Lomé` |
| `FACE_MATCH_TOLERANCE` | Seuil de reconnaissance (0-1) | `0.5` |
| `ANALYSIS_INTERVAL` | Fréquence d'analyse (sec) | `1.0` |

---

## 🌟 Fonctionnalités

### 🖥️ Dashboard Web
- 🔐 Authentification JWT (login/logout)
- 📊 Tableau de bord avec statistiques en temps réel
- 🗺️ Carte interactive des caméras (Leaflet)
- 🔔 Liste des alertes avec filtres et détails
- 📷 Gestion CRUD des caméras
- 👤 Gestion des personnes recherchées (ajout, recherche, photos)
- 📈 Page de statistiques avec graphiques (Recharts)

### 📱 Application Mobile
- 📋 Dashboard avec les dernières alertes
- 🔔 Notifications en temps réel
- 📍 Géolocalisation des incidents

### 🎥 Edge Computing
- 🧠 Détection faciale automatique via OpenCV
- 🔍 Reconnaissance par comparaison d'embeddings (face_recognition)
- 📡 Transmission des alertes via MQTT
- 💓 Heartbeat des caméras pour monitoring

### 🔧 Backend API
- 🚀 API REST complète (FastAPI + Swagger auto-généré)
- 🔐 Authentification JWT avec gestion de rôles
- 📡 Réception et stockage des alertes MQTT
- 🧠 Service de reconnaissance faciale (encodage + comparaison)
- 📦 Cache Redis pour les performances
- 🗃️ Migrations automatiques (Alembic)

---

## 📡 API Documentation

Une fois le backend démarré, accédez à la documentation interactive :

| Interface | URL |
|-----------|-----|
| **Swagger UI** | http://localhost:8000/docs |
| **ReDoc** | http://localhost:8000/redoc |

### Endpoints principaux

```
POST   /api/auth/login           # Connexion
POST   /api/auth/register        # Inscription

GET    /api/cameras              # Liste des caméras
POST   /api/cameras              # Ajouter une caméra
GET    /api/cameras/{id}         # Détails d'une caméra

GET    /api/alerts               # Liste des alertes
GET    /api/alerts/{id}          # Détails d'une alerte

GET    /api/persons              # Personnes recherchées
POST   /api/persons              # Ajouter une personne
POST   /api/persons/{id}/photo   # Ajouter photo + encoding facial

GET    /api/stats                # Statistiques globales
```

---

## 🔄 Flux de données

```
📷 Caméra Edge                    🖥️ Dashboard / 📱 Mobile
     │                                    ▲
     │ 1. Capture vidéo                   │ 5. Affichage alerte
     ▼                                    │    temps réel
🧠 face_detector.py                       │
     │                                    │
     │ 2. Visage détecté                  │
     │    → Comparaison embeddings        │
     ▼                                    │
📡 MQTT (EMQX)                           │
     │                                    │
     │ 3. Publication alerte              │
     │    Topic: togo/alert               │
     ▼                                    │
🚀 Backend FastAPI ───────────────────────┘
     │
     │ 4. Stockage PostgreSQL
     │    + Notification WebSocket
     ▼
🐘 PostgreSQL + 🔴 Redis
```

---

## 👥 Contributeurs

| Nom | Rôle |
|-----|------|
| **codeur777** | Développeur principal |

---

## 📄 Licence

Ce projet est développé dans le cadre d'une **soutenance de Licence Professionnelle**.

Tous droits réservés © 2026 — Togo SecureNet

---

<p align="center">
  <strong>🇹🇬 Fait avec ❤️ pour la sécurité du Togo</strong>
</p>
