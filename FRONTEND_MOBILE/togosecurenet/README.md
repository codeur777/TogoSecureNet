# TogoSecureNet Mobile

Application mobile Flutter pour les agents et forces de sécurité de TogoSecureNet.

## 🎯 Fonctionnalités

### 📱 Navigation
- **Accueil** : Statistiques du jour, intervention active, alertes récentes
- **Notifications** : Liste des alertes (non lues / toutes)
- **Profil** : Informations utilisateur et statistiques
- **Paramètres** : Sécurité, notifications, apparence

### 🚨 Gestion des Alertes
- Réception en temps réel via OneSignal
- Alertes critiques plein écran (très grave)
- Filtrage par gravité (très grave, grave, modéré)
- Détails complets avec carte de localisation
- Actions rapides (accepter, navigation, compléter)

### 🗺️ Géolocalisation & Navigation
- Carte Google Maps intégrée
- Position temps réel de l'agent
- Calcul de distance vers l'alerte
- Navigation GPS via Google Maps/Waze
- Suivi d'itinéraire

### 🎬 Workflow Intervention
1. **Réception alerte** → Notification push
2. **Consultation détails** → Carte + informations
3. **Acceptation** → `J'accepte l'intervention`
4. **Navigation** → `Démarrer la navigation` → Google Maps
5. **Arrivée** → `Je suis arrivé`
6. **Finalisation** → `Personne retrouvée` ou `Fausse alerte`

### 🔐 Sécurité
- Authentification JWT avec refresh token
- Double authentification (2FA) par OTP
- Tokens sécurisés avec flutter_secure_storage
- Sessions persistantes

## 🛠️ Technologies

- **Framework** : Flutter 3.x
- **State Management** : Riverpod
- **Routing** : GoRouter
- **Network** : Dio
- **Maps** : Google Maps Flutter
- **Notifications** : OneSignal
- **Géolocalisation** : Geolocator
- **Storage** : Flutter Secure Storage
- **Architecture** : Clean Architecture

## 📦 Installation

### Prérequis
- Flutter SDK 3.x
- Android Studio / Xcode
- Device Android/iOS ou émulateur

### Étapes
```bash
# 1. Cloner le repo
cd FRONTEND_MOBILE/togosecurenet

# 2. Installer les dépendances
flutter pub get

# 3. Configurer les clés API (voir CONFIG.md)

# 4. Lancer l'app
flutter run
```

## ⚙️ Configuration

Voir [CONFIG.md](CONFIG.md) pour :
- Configurer Google Maps API
- Configurer OneSignal
- Modifier l'URL du backend
- Permissions Android/iOS
- Build production

## 🎨 Design System

### Couleurs
- **Vert Principal** : `#16A34A`
- **Vert Clair** : `#DCFCE7`
- **Rouge Alerte** : `#DC2626`
- **Orange Moyen** : `#F59E0B`

### Inspiration
- Uber Driver
- Waze
- Google Maps
- Material Design 3

## 📱 Screenshots

*(À ajouter après tests)*

## 🧪 Tests

```bash
# Tests unitaires
flutter test

# Tests sur device
flutter run --release
```

## 📦 Build Production

### Android APK
```bash
flutter build apk --release
```
Fichier : `build/app/outputs/flutter-apk/app-release.apk`

### Android App Bundle (Google Play)
```bash
flutter build appbundle --release
```

### iOS
```bash
flutter build ios --release
```

## 🔄 Backend

L'app consomme le backend FastAPI existant :
- URL par défaut : `http://localhost:8000/api/v1`
- Endpoints utilisés :
  - `/auth/login` - Connexion
  - `/auth/verify-otp` - Vérification OTP
  - `/auth/me` - Profil utilisateur
  - `/alertes/` - Liste des alertes
  - `/alertes/{id}` - Détails alerte
  - `/alertes/{id}/lire` - Marquer comme lu

## 👥 Rôles Supportés

- **Agent** ✅
- **Superviseur** ✅
- **Admin** ❌ (utiliser l'app web)
- **Citoyen** ❌ (utiliser l'app web)

## 📝 TODO

- [ ] Extraire lat/lng réels depuis `alert.localisation`
- [ ] Implémenter édition profil
- [ ] Implémenter changement mot de passe
- [ ] Ajouter historique des interventions
- [ ] Mode hors ligne (cache local)
- [ ] Synchronisation des données
- [ ] Ajout photo lors de la complétion
- [ ] Rapport d'intervention détaillé

## 🤝 Contribution

1. Créer une branche feature
2. Commit les changements
3. Push vers la branche
4. Créer une Pull Request

## 📄 Licence

Projet académique - Licence TOGO

## 👨‍💻 Auteurs

Équipe TogoSecureNet - Soutenance Licence 2026
