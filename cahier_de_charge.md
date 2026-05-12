Voici un **cahier des charges complet et professionnel** pour ton projet **Togo SecureNet**. Tu peux le donner directement à ton maître de stage ou t'en servir comme document de référence.

---

# CAHIER DES CHARGES

## Système interconnecté de surveillance vidéo intelligente pour la recherche de personnes disparues et d'engins volés

### **TOGO SECURENET**

---

| Version | Date | Auteur | Modifications |
|---------|------|--------|---------------|
| 1.0 | [Date] | [Ton nom] | Version initiale |

---

## SOMMAIRE

1. [Présentation du projet](#1-présentation-du-projet)
2. [Contexte et problématique](#2-contexte-et-problématique)
3. [Objectifs du projet](#3-objectifs-du-projet)
4. [Périmètre fonctionnel](#4-périmètre-fonctionnel)
5. [Spécifications fonctionnelles détaillées](#5-spécifications-fonctionnelles-détaillées)
6. [Spécifications techniques](#6-spécifications-techniques)
7. [Architecture du système](#7-architecture-du-système)
8. [Base de données](#8-base-de-données)
9. [Interfaces utilisateur](#9-interfaces-utilisateur)
10. [Contraintes et exigences](#10-contraintes-et-exigences)
11. [Planning prévisionnel](#11-planning-prévisionnel)
12. [Livrables attendus](#12-livrables-attendus)
13. [Risques et solutions](#13-risques-et-solutions)
14. [Considérations éthiques et légales](#14-considérations-éthiques-et-légales)
15. [Glossaire](#15-glossaire)

---

## 1. PRÉSENTATION DU PROJET

| Champ | Description |
|-------|-------------|
| **Nom du projet** | Togo SecureNet |
| **Type de projet** | Système interconnecté de vidéosurveillance intelligent |
| **Durée** | 3 mois |
| **Commanditaire** | [Nom de l'entreprise ou structure d'accueil] |
| **Réalisateur** | [Ton nom], étudiant en 3ème année Génie Logiciel et Systèmes d'Information |
| **Objectif principal** | Réduire le temps de localisation des personnes disparues et des engins volés grâce à un réseau de caméras interconnectées dotées d'intelligence artificielle |

---

## 2. CONTEXTE ET PROBLÉMATIQUE

### 2.1 Contexte

Le Togo a récemment connu une augmentation significative des cas de disparition de personnes et de vols de motos. Les moyens actuels pour faire face à cette situation présentent des limites importantes :

- **Avis de recherche passifs** : diffusion sur réseaux sociaux ou médias, nécessitant une action citoyenne volontaire
- **Caméras isolées** : absence d'interconnexion entre les systèmes de surveillance existants
- **Délai d'intervention long** : perte d'heures précieuses entre la disparition et le déclenchement des recherches
- **Absence de détection automatique** : aucune solution technologique pour alerter proactivement les forces de l'ordre

### 2.2 Problématique

**Comment interconnexionner et doter d'intelligence artificielle le réseau de caméras de surveillance du Togo pour permettre la détection automatique et l'alerte en temps réel des personnes disparues et des engins volés ?**

### 2.3 Utilisateurs cibles

| Utilisateur | Rôle | Nombre estimé |
|-------------|------|---------------|
| **Administrateur système** | Gère les caméras, les utilisateurs, supervise le système | 2-3 |
| **Agent de police/OPJ** | Déclare les disparitions, valide les alertes, déclenche les interventions | 50-100 |
| **Superviseur sécurité** | Visionne le dashboard, prend des décisions pour les alertes niveau orange | 10-20 |
| **Équipe d'intervention** | Reçoit les alertes sur mobile, intervient sur le terrain | 200-500 |

---

## 3. OBJECTIFS DU PROJET

### 3.1 Objectif général

Développer un système interconnecté de surveillance vidéo utilisant l'intelligence artificielle pour détecter automatiquement les personnes disparues et les engins volés, et déclencher des alertes en temps réel auprès des forces de l'ordre.

### 3.2 Objectifs spécifiques

| # | Objectif | Critère de réussite |
|---|----------|---------------------|
| OS1 | Interconnecter des caméras de surveillance sur un réseau central | Au moins 3 caméras simulées communiquent avec le serveur |
| OS2 | Implémenter une reconnaissance faciale pour identifier les personnes disparues | Taux de précision > 85% dans des conditions standards |
| OS3 | Implémenter une lecture automatique des plaques d'immatriculation | Taux de reconnaissance > 80% pour les plaques lisibles |
| OS4 | Créer un système d'alerte à 3 niveaux de gravité | Routing différent selon la gravité |
| OS5 | Développer un dashboard admin temps réel | Affichage des alertes < 2 secondes après détection |
| OS6 | Développer une application mobile pour les forces de l'ordre | Notification push reçue < 5 secondes |
| OS7 | Permettre l'accès aux caméras à distance | Visualisation du flux hors réseau local |

### 3.3 Objectifs pédagogiques (pour le stagiaire)

| # | Objectif |
|---|----------|
| OP1 | Maîtriser le développement d'une API REST avec FastAPI |
| OP2 | Implémenter une solution de computer vision (reconnaissance faciale) |
| OP3 | Mettre en place une architecture événementielle avec MQTT et WebSocket |
| OP4 | Développer une application cross-platform avec React Native |
| OP5 | Gérer un projet de A à Z avec méthodologie agile |
| OP6 | Rédiger une documentation technique complète |

---

## 4. PÉRIMÈTRE FONCTIONNEL

### 4.1 Ce qui est inclus (scope IN)

| Module | Fonctionnalités |
|--------|-----------------|
| **Gestion des personnes disparues** | Enregistrement, modification, archivage, suppression |
| **Reconnaissance faciale** | Extraction d'empreintes faciales (embeddings), comparaison automatique |
| **Gestion des engins volés** | Enregistrement par plaque, marque, modèle, couleur |
| **Analyse vidéo en temps réel** | Détection visages, lecture plaques, matching |
| **Système d'alerte** | 3 niveaux de gravité (vert/orange/rouge), routing automatique |
| **Dashboard administrateur** | Visualisation cartographique, liste alertes, validation manuelle |
| **Application mobile police** | Réception alertes, localisation, accusé réception |
| **Accès distant caméras** | Tunnel sécurisé pour visualisation hors réseau |
| **Génération portrait-robot** | Conversion description textuelle → image (version simplifiée) |
| **Journalisation** | Traçabilité de toutes les actions (audit trail) |

### 4.2 Ce qui est exclu (scope OUT)

| Fonctionnalité | Raison de l'exclusion |
|----------------|----------------------|
| Déploiement sur 100+ caméras réelles | Hors délai (3 mois) |
| Reconnaissance faciale avec masque | Complexité technique supplémentaire |
| Analyse comportementale (détection chute, bagarre) | Hors périmètre initial |
| Intégration avec systèmes existants (CNI, minitaire) | Dépendances externes non maîtrisées |
| Hébergement cloud haute disponibilité | Coût et complexité opérationnelle |
| Certification RGPD/complète | Hors compétence stage, nécessite juriste |

---

## 5. SPÉCIFICATIONS FONCTIONNELLES DÉTAILLÉES

### 5.1 Module : Gestion des personnes disparues

| Identifiant | SF-PERS-01 |
|-------------|-------------|
| **Titre** | Enregistrement d'une personne disparue |
| **Acteurs** | Agent de police, Administrateur |
| **Précondition** | Utilisateur authentifié avec rôle approprié |
| **Données d'entrée** | • Photos (minimum 3, max 10)<br>• Âge (date de naissance ou estimation)<br>• Sexe (H/F)<br>• Taille (cm)<br>• Signes particuliers (texte libre)<br>• Dernière localisation connue<br>• Date de disparition<br>• Niveau de gravité (vert/orange/rouge)<br>• Contact famille (téléphone) |
| **Traitement** | 1. Validation des données saisies<br>2. Extraction des embeddings faciaux (vecteurs 512D)<br>3. Stockage en base de données<br>4. Indexation pour recherche rapide |
| **Sortie** | Confirmation d'enregistrement + ID unique |
| **Exceptions** | • Photos floues ou sans visage → rejet<br>• Format photo non supporté → erreur<br>• Données manquantes → message validation |

| Identifiant | SF-PERS-02 |
|-------------|-------------|
| **Titre** | Génération de portrait-robot |
| **Acteurs** | Agent de police, Administrateur |
| **Précondition** | Aucune photo disponible de la personne |
| **Données d'entrée** | • Âge (estimation)<br>• Sexe<br>• Ethnie (optionnel)<br>• Morphologie du visage (ovale, rond, carré)<br>• Couleur des yeux/cheveux<br>• Signes particuliers (cicatrice, barbe, lunettes) |
| **Traitement** | 1. Conversion description textuelle → attributs<br>2. Génération via modèle StyleGAN2 ou API externe<br>3. Proposition de 3 variations<br>4. Sélection par l'utilisateur<br>5. Stockage comme photo principale |
| **Sortie** | Image générée (portrait-robot) |
| **Limitation** | Version simplifiée : combinaison de traits plutôt que génération IA pure |

### 5.2 Module : Surveillance et reconnaissance

| Identifiant | SF-SURV-01 |
|-------------|------------|
| **Titre** | Analyse vidéo par caméra (Edge) |
| **Acteurs** | Caméra (système automatisé) |
| **Précondition** | Caméra active et connectée au broker MQTT |
| **Fréquence** | 1 frame par seconde (configurable) |
| **Traitement** | 1. Capture frame depuis flux vidéo<br>2. Détection des visages (OpenCV Haarcascade / DNN)<br>3. Pour chaque visage : extraction embedding<br>4. Comparaison avec embeddings des personnes disparues<br>5. Seuil de similarité : 0.85 (configurable)<br>6. Si match : création alerte |
| **Complexité temporelle** | < 500ms par frame sur Raspberry Pi 4 |

| Identifiant | SF-SURV-02 |
|-------------|------------|
| **Titre** | Reconnaissance des plaques de motos volées |
| **Acteurs** | Caméra (système automatisé) |
| **Précondition** | Base des motos volées non vide |
| **Traitement** | 1. Détection de la zone de la plaque (contours)<br>2. OCR avec Tesseract ou EasyOCR<br>3. Normalisation texte (TOGO-XXXXX)<br>4. Recherche en base des véhicules volés<br>5. Si match : création alerte |

### 5.3 Module : Gestion des alertes

| Identifiant | SF-ALERT-01 |
|-------------|-------------|
| **Titre** | Création et routage d'alerte |
| **Acteurs** | Système (automatique) |
| **Précondition** | Match détecté par une caméra |
| **Traitement** | 1. Création objet alerte (ID, personne/caméra, photo_capturée, confiance, timestamp)<br>2. Stockage en base + Redis cache<br>3. Détermination routage selon gravité :<br>   • **ROUGE** → notification police directe (SMS + Push)<br>   • **ORANGE** → notification admin pour validation<br>   • **VERT** → notification admin (non prioritaire)<br>4. Envoi via WebSocket aux clients connectés<br>5. Publication sur topic MQTT "togo/alerts" |

| Identifiant | SF-ALERT-02 |
|-------------|-------------|
| **Titre** | Validation d'alerte (Admin) |
| **Acteurs** | Administrateur |
| **Précondition** | Alerte de niveau ORANGE ou VERT en statut "pending" |
| **Données d'entrée** | • Action : VALIDATE ou REJECT<br>• Commentaire (optionnel) |
| **Traitement** | 1. Mise à jour statut alerte<br>2. Si VALIDATE : déclenchement dispatch police<br>3. Si REJECT : clôture alerte + justification<br>4. Log de l'action (audit) |
| **Sortie** | Notification à la police (si validée) |

| Identifiant | SF-ALERT-03 |
|-------------|-------------|
| **Titre** | Anti-spam (dédoublonnage) |
| **Acteurs** | Système (automatique) |
| **Précondition** | Alerte créée pour (personne, caméra) |
| **Traitement** | 1. Vérification Redis : clé "alert:{person_id}:{camera_id}"<br>2. Si clé existe → alerte déjà envoyée récemment → ignore<br>3. Si clé inexistante → création alerte + setex TTL 300s (5 min) |

### 5.4 Module : Administration

| Identifiant | SF-ADMIN-01 |
|-------------|-------------|
| **Titre** | Gestion des caméras |
| **Acteurs** | Administrateur |
| **Opérations** | • Ajout d'une caméra (nom, localisation, URL RTSP)<br>• Modification<br>• Suppression (soft delete)<br>• Activation/Désactivation<br>• Visualisation statut (online/offline via heartbeat) |

| Identifiant | SF-ADMIN-02 |
|-------------|-------------|
| **Titre** | Gestion des utilisateurs |
| **Acteurs** | Super administrateur |
| **Rôles** | • ADMIN : accès tableau de bord, validation alertes<br>• POLICE : accès app mobile, déclaration disparitions<br>• SUPER_ADMIN : tout + gestion users |
| **Opérations** | Création, modification, suppression, attribution rôles |

| Identifiant | SF-ADMIN-03 |
|-------------|-------------|
| **Titre** | Mode urgence nationale |
| **Acteurs** | Super administrateur |
| **Effet** | Toutes les alertes (quel que soit leur niveau original) sont traitées comme ROUGE → dispatch direct police |
| **Durée** | Paramétrable (1h, 6h, 24h, jusqu'à désactivation) |

### 5.5 Module : Interfaçage distant caméras

| Identifiant | SF-REMOTE-01 |
|-------------|--------------|
| **Titre** | Accès aux caméras hors réseau |
| **Acteurs** | Administrateur |
| **Problème** | Caméras en réseau local, pas d'IP publique |
| **Solution** | Tunnel sécurisé (Cloudflare Tunnel / ngrok) ou Reverse proxy |
| **Fonctionnement** | 1. Agent installé sur le réseau de la caméra<br>2. Tunnel sortant vers serveur central<br>3. Dashboard accède via URL publique sécurisée<br>4. Authentification requise |

---

## 6. SPÉCIFICATIONS TECHNIQUES

### 6.1 Stack logicielle

| Composant | Technologie | Version | Justification |
|-----------|-------------|---------|----------------|
| **Backend API** | FastAPI (Python) | 0.100+ | Async natif, excellente doc, facile pour IA |
| **Base données** | PostgreSQL | 15+ | Robuste, standard |
| **Extension vecteurs** | pgvector | 0.5+ | Embeddings faciaux en base, pas de serveur dédié |
| **Cache / Sessions** | Redis | 7+ | Ultra rapide, parfait pour alerts temps réel |
| **Broker MQTT** | EMQX | 5.0+ | Support WebSocket, dashboard intégré |
| **WebSocket** | FastAPI WebSocket | - | Push alerts en temps réel |
| **Frontend Admin** | React + Vite | 18+ | Rapide, moderne |
| **UI Admin** | TailwindCSS + HeadlessUI | - | CSS utilitaire, composants accessibles |
| **Cartographie** | Leaflet + OpenStreetMap | - | Gratuit, pas de clé API |
| **Mobile** | React Native (Expo) | 49+ | Cross-platform, hot reload |
| **Edge (caméra)** | Python + OpenCV | 4.8+ | Standard en computer vision |
| **Reconnaissance** | face_recognition (dlib) | 1.3+ | Embeddings 128D, bonne précision |
| **OCR plaques** | EasyOCR ou Tesseract | - | Support Togo (chiffres/latins) |
| **Conteneurisation** | Docker + Docker Compose | - | Déploiement reproductible |
| **Versionnement** | Git (GitHub) | - | Code source versionné |

### 6.2 Configuration minimale requise

| Environnement | CPU | RAM | Stockage | OS |
|---------------|-----|-----|----------|-----|
| **Serveur central** | 4 cœurs | 8 Go | 50 Go SSD | Ubuntu 22.04 / Debian 12 |
| **Caméra edge (RPi)** | ARM Cortex-A72 | 4 Go | 32 Go | Raspberry Pi OS |
| **Poste admin** | 2 cœurs | 4 Go | - | Windows/Linux/Mac |
| **Mobile** | - | 2 Go | - | Android 10+ / iOS 14+ |

### 6.3 Architecture réseau

```
                    ┌─────────────────────────────────────┐
                    │         SERVEUR CENTRAL              │
                    │  (DigitalOcean / VPS / On-Premise)   │
                    │  • API (port 8000)                   │
                    │  • WebSocket (port 8000)             │
                    │  • MQTT (port 1883 TCP, 8083 WS)    │
                    │  • PostgreSQL (5432)                 │
                    │  • Redis (6379)                      │
                    └──────────────┬──────────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
        ┌─────▼─────┐        ┌─────▼─────┐        ┌─────▼─────┐
        │  CAM-001  │        │  CAM-002  │        │  CAM-003  │
        │ (Lomé)    │        │ (Kara)    │        │ (Sokodé)  │
        │ RPi + cam │        │ RPi + cam │        │ RPi + cam │
        │ └ MQTT    │        │ └ MQTT    │        │ └ MQTT    │
        └───────────┘        └───────────┘        └───────────┘
              │                    │                    │
              └────────────────────┼────────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
        ┌─────▼─────┐        ┌─────▼─────┐        ┌─────▼─────┐
        │Dashboard  │        │ App Police│        │ SMS Gateway│
        │Admin (Web)│        │ (Mobile)  │        │           │
        └───────────┘        └───────────┘        └───────────┘
```

### 6.4 Sécurité

| Exigence | Solution |
|----------|----------|
| Authentification | JWT (JSON Web Tokens) avec refresh token |
| Hashing mots de passe | bcrypt (passlib) |
| Chiffrement données sensibles | AES-256 pour embeddings en transit |
| Communication caméra → serveur | TLS (MQTT over SSL) |
| Protection API | Rate limiting (redis) |
| Audit trail | Table logs avec timestamp + utilisateur + action |
| Sauvegardes | pg_dump quotidien + offsite |

---

## 7. ARCHITECTURE DU SYSTÈME

### 7.1 Vue logique (composants et interactions)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              EDGE (Raspberry Pi)                            │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │ OpenCV   │───▶│ Détection│───▶│ face_rec │───▶│ Comparai-│              │
│  │ Capture  │    │ visages  │    │ (dlib)   │    │ son      │              │
│  └──────────┘    └──────────┘    └──────────┘    └────┬─────┘              │
│                                                        │                     │
│                                                   ┌────▼─────┐               │
│                                                   │ MQTT     │               │
│                                                   │ Client   │               │
│                                                   └────┬─────┘               │
└────────────────────────────────────────────────────────┼─────────────────────┘
                                                         │ MQTT (1883/TLS)
                                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BROKER MQTT (EMQX)                              │
│  Topics :                                                                   │
│  • togo/camera/{id}/heartbeat → statut caméra                               │
│  • togo/camera/{id}/alert     → alerte brute                                │
│  • togo/camera/{id}/frame     → image capturée (optionnel)                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                                         │
                                                         │ WebSocket (8083)
                                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (FastAPI)                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ REST API    │  │ WebSocket   │  │ MQTT Sub    │  │ Service     │        │
│  │ /persons    │  │ /ws/alerts  │  │ Consumer    │  │ Alert       │        │
│  │ /alerts     │  │ /ws/dash    │  │             │  │             │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         └────────────────┼────────────────┼────────────────┘               │
│                          │                │                                  │
│                    ┌─────▼─────┐    ┌──────▼──────┐                          │
│                    │ PostgreSQL│    │   Redis     │                          │
│                    │ + pgvector│    │  (cache)    │                          │
│                    └───────────┘    └─────────────┘                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                                         │
                    ┌────────────────────────────────────┼────────────────────┐
                    │ REST (8000)                        │ WebSocket          │
                    ▼                                    ▼                     │
┌───────────────────────────────┐          ┌───────────────────────────────┐  │
│     DASHBOARD ADMIN (React)    │          │   APP POLICE (React Native)   │  │
│  • Carte (Leaflet)            │          │  • Liste alertes              │  │
│  • Liste alertes temps réel   │          │  • Notification push          │  │
│  • Validation/R  ejet          │          │  • Détails intervention       │  │
│  • CRUD personnes/caméras      │          │  • Localisation GPS           │  │
└───────────────────────────────┘          └───────────────────────────────┘  │
                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Flux de données (séquence)

```
[Caméra]          [MQTT]           [Backend]         [Redis]        [Dashboard]      [Police]
   │                │                  │                │               │               │
   │──frame────────▶│                  │                │               │               │
   │                │───alert─────────▶│                │               │               │
   │                │                  │──check cache──▶│               │               │
   │                │                  │◀──cache miss───│               │               │
   │                │                  │──save alerte──▶│ (DB)          │               │
   │                │                  │                │               │               │
   │                │                  │───WebSocket────┼──────────────▶│               │
   │                │                  │                │               │ (affichage)   │
   │                │                  │                │               │               │
   │                │                  │──check gravité─│               │               │
   │                │                  │   (ROUGE) ─────────────────────────────────────▶│
   │                │                  │                │               │               │
   │                │                  │                              [Notification]    │
   │                │                  │                │               │               │──accuse──▶
```

---

## 8. BASE DE DONNÉES

### 8.1 Modèle relationnel (PostgreSQL)

```sql
-- Table : users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(50) CHECK (role IN ('super_admin', 'admin', 'police')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- Table : persons (disparus)
CREATE TABLE persons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    age INT,
    gender VARCHAR(10) CHECK (gender IN ('M', 'F', 'other')),
    height_cm INT,
    distinctive_signs TEXT,
    last_location TEXT,
    disappearance_date DATE,
    gravity_level VARCHAR(20) CHECK (gravity_level IN ('low', 'high', 'critical')),
    family_contact VARCHAR(50),
    status VARCHAR(20) DEFAULT 'missing' CHECK (status IN ('missing', 'found', 'archived')),
    reported_by UUID REFERENCES users(id),
    reported_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP,
    embedding VECTOR(512)  -- pgvector
);

-- Table : person_photos
CREATE TABLE person_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id UUID REFERENCES persons(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    embedding VECTOR(512),
    is_primary BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Table : cameras
CREATE TABLE cameras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    address TEXT,
    rtsp_url TEXT,
    status VARCHAR(20) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'maintenance')),
    last_heartbeat TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table : alerts
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id UUID REFERENCES persons(id),
    camera_id UUID REFERENCES cameras(id),
    alert_type VARCHAR(20) CHECK (alert_type IN ('facial', 'plate', 'both')),
    captured_photo_url TEXT,
    confidence DECIMAL(5, 2),
    gravity_level VARCHAR(20) CHECK (gravity_level IN ('low', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'rejected', 'dispatched', 'resolved')),
    validated_by UUID REFERENCES users(id),
    validated_at TIMESTAMP,
    dispatched_to UUID REFERENCES users(id),
    dispatched_at TIMESTAMP,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table : vehicles (motos volées)
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    brand VARCHAR(50),
    model VARCHAR(50),
    color VARCHAR(30),
    stolen_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'stolen' CHECK (status IN ('stolen', 'recovered', 'archived')),
    owner_name VARCHAR(100),
    owner_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table : audit_logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100),
    target_type VARCHAR(50),
    target_id UUID,
    details JSONB,
    ip_address INET,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_persons_status ON persons(status);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_created ON alerts(created_at DESC);
CREATE INDEX idx_cameras_status ON cameras(status);

-- Index vectoriel pour recherche faciale (pgvector)
CREATE INDEX idx_persons_embedding ON persons USING ivfflat (embedding vector_cosine_ops);
```

### 8.2 Structure Redis (cache)

| Clé | Type | TTL | Description |
|-----|------|-----|-------------|
| `alert:{person_id}:{camera_id}` | String | 300s | Anti-spam (5 min) |
| `user:{user_id}:session` | Hash | 3600s | Session utilisateur |
| `ws:clients:{client_id}` | String | 600s | Client WebSocket actif |
| `camera:status:{camera_id}` | String | 60s | Dernier heartbeat |
| `rate:limit:{ip}:{endpoint}` | Integer | 60s | Rate limiting |

---

## 9. INTERFACES UTILISATEUR

### 9.1 Dashboard administrateur (Web)

| Écran | Contenu |
|-------|---------|
| **Dashboard principal** | Carte du Togo avec marqueurs caméras + liste alertes temps réel + statistiques (alertes/jour) |
| **Alertes** | Tableau avec filtres (gravité, statut, date) + action "Valider/Rejeter" |
| **Personnes disparues** | Liste + formulaire ajout avec upload photos (3 min) + génération portrait-robot |
| **Caméras** | Liste + formulaire ajout (nom, coordonnées, URL RTSP) + statut heartbeat |
| **Utilisateurs** | Gestion des comptes (admin/police) |
| **Statistiques** | Graphiques (recharts) : alertes par jour, temps moyen validation, top caméras |

### 9.2 Application mobile (Police)

| Écran | Contenu |
|-------|---------|
| **Connexion** | Email / Mot de passe + biométrique (optionnel) |
| **Alertes** | Liste chronologique (rouge en priorité) avec photo, localisation, distance |
| **Détail alerte** | Photo capturée, photo référence, localisation sur carte, bouton "Intervention envoyée" |
| **Profil** | Informations agent, historique interventions |
| **Notifications** | Push avec son distinctif pour alertes rouges |

### 9.3 Simulation Edge (caméra)

| Interface | Description |
|-----------|-------------|
| **Console** | Affichage flux webcam + bounding boxes sur visages détectés + logs "Match found" |
| **Configuration** | fichier config.py (ID caméra, localisation, seuil similarité) |

---

## 10. CONTRAINTES ET EXIGENCES

### 10.1 Contraintes techniques

| Contrainte | Description |
|------------|-------------|
| **Bande passante** | Edge caméra doit fonctionner avec connexion faible (2G/3G) → envoi uniquement métadonnées, pas flux vidéo brut |
| **Latence** | Alerte < 5 secondes entre détection et notification police |
| **Disponibilité** | Objectif 99% (hors maintenance) |
| **Sécurité** | Chiffrement TLS pour toutes les communications externes |
| **Scalabilité** | Architecture permettant ajout de caméras sans modification majeure |

### 10.2 Contraintes budgétaires

| Poste | Coût estimé | Financement |
|-------|-------------|-------------|
| Serveur cloud (VPS 4GB/80GB) | 15-20€/mois | Infrastructure structure accueil |
| Nom de domaine (optionnel) | 10€/an | Structure accueil |
| API SMS (Twilio test) | 5€ (crédit initial) | Stagiaire (ou gratuit via API locale) |
| Raspberry Pi (test) | 60-80€ | Structure accueil (ou prêt) |
| **Total** | **~100€** | À discuter avec maître de stage |

### 10.3 Contraintes de délais (3 mois)

| Phase | Durée | Dates estimées |
|-------|-------|----------------|
| Phase 1 : Setup infra + base | 2 semaines | S1-S2 |
| Phase 2 : Backend API (CRUD) | 3 semaines | S3-S5 |
| Phase 3 : Reconnaissance faciale | 3 semaines | S6-S8 |
| Phase 4 : Frontend Dashboard | 3 semaines | S6-S8 (parallèle) |
| Phase 5 : Mobile App | 2 semaines | S9-S10 |
| Phase 6 : Tests + documentation | 2 semaines | S11-S12 |
| **Total** | **12 semaines** | |

---

## 11. PLANNING PRÉVISIONNEL

### Diagramme de Gantt (simplifié)

```
Semaine :      S1   S2   S3   S4   S5   S6   S7   S8   S9   S10  S11  S12
Tâche
Setup PostgreSQL/pgvector     ██   ██
Setup Redis/EMQX              ██   ██
API FastAPI (CRUD)                  ██   ██   ██
Base données + modèles              ██   ██
Reconnaissance faciale (script)                 ██   ██   ██
Service comparaison (embeddings)                ██   ██
Dashboard React (basique)                           ██   ██   ██
Carte Leaflet +