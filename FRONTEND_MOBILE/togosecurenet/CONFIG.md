# Configuration TogoSecureNet Mobile

## 1. Clés API à configurer

### Google Maps API Key

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un projet ou sélectionner un projet existant
3. Activer l'API "Maps SDK for Android" et "Maps SDK for iOS"
4. Créer une clé API dans "Credentials"
5. Remplacer dans les fichiers :

**Android**: `android/app/src/main/AndroidManifest.xml`
```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="VOTRE_CLE_GOOGLE_MAPS_ICI" />
```

**iOS**: Ajouter dans `ios/Runner/AppDelegate.swift`
```swift
import GoogleMaps

override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
) -> Bool {
    GMSServices.provideAPIKey("VOTRE_CLE_GOOGLE_MAPS_ICI")
    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
}
```

### OneSignal App ID

1. Créer un compte sur [OneSignal](https://onesignal.com/)
2. Créer une nouvelle app
3. Configurer les plateformes (Android et iOS)
4. Copier l'App ID
5. Remplacer dans `lib/core/services/notification_service.dart`:
```dart
static const String ONESIGNAL_APP_ID = 'VOTRE_ONESIGNAL_APP_ID_ICI';
```

## 2. Configuration Backend

Dans `lib/core/constants/app_constants.dart`, modifier l'URL du backend :

```dart
static const String baseUrl = 'http://VOTRE_IP:8000/api/v1';
```

**Important**: 
- Sur émulateur Android : utiliser `http://10.0.2.2:8000/api/v1`
- Sur device physique : utiliser l'IP locale de votre PC (ex: `http://192.168.1.100:8000/api/v1`)

## 3. Permissions

### Android
Déjà configurées dans `android/app/src/main/AndroidManifest.xml`:
- ✅ INTERNET
- ✅ ACCESS_FINE_LOCATION
- ✅ ACCESS_COARSE_LOCATION
- ✅ ACCESS_BACKGROUND_LOCATION
- ✅ VIBRATE
- ✅ POST_NOTIFICATIONS

### iOS
Déjà configurées dans `ios/Runner/Info.plist`:
- ✅ NSLocationWhenInUseUsageDescription
- ✅ NSLocationAlwaysUsageDescription
- ✅ NSLocationAlwaysAndWhenInUseUsageDescription
- ✅ UIBackgroundModes (location, fetch, remote-notification)

## 4. Installation des dépendances

```bash
cd FRONTEND_MOBILE/togosecurenet
flutter pub get
```

## 5. Lancer l'application

### Sur émulateur Android
```bash
flutter run
```

### Sur device physique
1. Activer le mode développeur sur le téléphone
2. Connecter en USB
3. Autoriser le débogage USB
4. Lancer :
```bash
flutter run
```

### Build APK (Android)
```bash
flutter build apk --release
```
APK dans : `build/app/outputs/flutter-apk/app-release.apk`

### Build App Bundle (Android)
```bash
flutter build appbundle --release
```

### Build IPA (iOS)
```bash
flutter build ios --release
```

## 6. Tests

### Vérifier les permissions
```bash
flutter run --verbose
```

### Tester les notifications
1. Installer l'app sur un device réel
2. Accepter les permissions de notification
3. Depuis le dashboard OneSignal, envoyer une notification test
4. Vérifier la réception

### Tester la géolocalisation
1. Accepter les permissions de localisation
2. Vérifier que la carte affiche votre position
3. Tester la navigation vers une alerte

## 7. Troubleshooting

### Problème de connexion backend
- Vérifier que le backend est lancé : `docker-compose up`
- Sur device physique, vérifier que PC et téléphone sont sur le même réseau WiFi
- Ping l'IP du PC depuis le téléphone

### Notifications ne fonctionnent pas
- Vérifier que l'App ID OneSignal est correct
- Vérifier les permissions dans les paramètres du téléphone
- Sur iOS, les notifications ne fonctionnent que sur device réel

### Carte ne s'affiche pas
- Vérifier que la clé API Google Maps est valide
- Vérifier que les APIs sont activées dans Google Cloud Console
- Vérifier les permissions de localisation

## 8. Configuration Firewall (Windows)

Si le device ne peut pas se connecter au backend sur Windows :

```bash
# Autoriser le port 8000 dans le pare-feu Windows
netsh advfirewall firewall add rule name="Backend TogoSecureNet" dir=in action=allow protocol=TCP localport=8000
```

## 9. Identifiants de test

**Agent**:
- Email: `agent@togosecure.net`
- Password: `agent123`

**Superviseur**:
- Email: `superviseur@togosecure.net`
- Password: `superviseur123`

**Admin**:
- Email: `admin@togosecure.net`
- Password: `admin123`
