# Tests de l'Application Mobile TogoSecureNet

## ✅ Checklist de Tests

### 1. Configuration Initiale
- [ ] Flutter installé (`flutter --version`)
- [ ] Dépendances installées (`flutter pub get`)
- [ ] Émulateur/Device connecté (`flutter devices`)
- [ ] Backend lancé (Docker)

### 2. Tests de Connexion

#### Test 1 : Connexion sans 2FA (Citoyen)
**Note**: Les citoyens ne devraient pas accéder à l'app mobile, mais pour test :
```
Email: citoyen@togosecure.net
Password: citoyen123
Résultat attendu: Connexion directe sans OTP
```

#### Test 2 : Connexion avec 2FA (Agent)
```
Email: agent@togosecure.net
Password: agent123
Résultat attendu: 
1. Redirection vers page OTP
2. Code OTP reçu par email
3. Saisie code → Connexion réussie
```

#### Test 3 : Connexion avec 2FA (Superviseur)
```
Email: superviseur@togosecure.net
Password: superviseur123
Résultat attendu: Même workflow que Agent
```

#### Test 4 : Mauvais identifiants
```
Email: wrong@email.com
Password: wrong123
Résultat attendu: Message d'erreur "Identifiants invalides"
```

#### Test 5 : Mauvais code OTP
```
Email: agent@togosecure.net
Password: agent123
OTP: 000000
Résultat attendu: Message "Code invalide"
```

### 3. Tests de Navigation

#### Test 6 : Navigation Bottom Bar
- [ ] Onglet Accueil : Affiche statistiques + alertes
- [ ] Onglet Notifications : Liste des alertes
- [ ] Onglet Profil : Infos utilisateur
- [ ] Onglet Paramètres : Options
- [ ] Animation et indicateur visuel sur onglet actif

#### Test 7 : Navigation vers détails alerte
- [ ] Clic sur alerte depuis Accueil → Détails
- [ ] Clic sur alerte depuis Notifications → Détails
- [ ] Bouton retour fonctionne

### 4. Tests des Alertes

#### Test 8 : Liste des alertes
- [ ] Affichage liste non lues
- [ ] Affichage liste toutes
- [ ] Badge compteur non lues
- [ ] Pull to refresh fonctionne

#### Test 9 : Détails alerte
- [ ] Informations complètes affichées
- [ ] Niveau de gravité visible (couleur)
- [ ] Carte affichée avec markers
- [ ] Distance calculée

#### Test 10 : Marquer comme lu
- [ ] Ouvrir une alerte non lue
- [ ] Vérifier qu'elle devient lue
- [ ] Badge compteur se décrémente

### 5. Tests d'Intervention

#### Test 11 : Accepter une intervention
```
1. Clic sur alerte non traitée
2. Clic "J'accepte l'intervention"
Résultat attendu:
- Intervention créée avec status "accepted"
- Carte active visible sur Accueil
- Bouton "Démarrer navigation" disponible
```

#### Test 12 : Démarrer navigation
```
1. Depuis intervention active
2. Clic "Démarrer la navigation"
Résultat attendu:
- Google Maps s'ouvre avec itinéraire
- Status passe à "onTheWay"
```

#### Test 13 : Marquer arrivé
```
1. Depuis intervention "En route"
2. Clic "Je suis arrivé"
Résultat attendu:
- Status passe à "arrived"
- Boutons "Personne retrouvée" et "Fausse alerte" apparaissent
```

#### Test 14 : Compléter intervention
```
1. Depuis intervention "Sur place"
2. Clic "Personne retrouvée"
Résultat attendu:
- Status passe à "completed"
- Intervention disparaît de l'accueil
- Statistiques mises à jour
```

#### Test 15 : Fausse alerte
```
1. Depuis intervention "Sur place"
2. Clic "Fausse alerte"
Résultat attendu:
- Status passe à "falseAlarm"
- Intervention fermée
```

#### Test 16 : Intervention bloquante
```
1. Accepter une intervention
2. Essayer d'accepter une autre
Résultat attendu:
- Message "Une intervention est déjà en cours"
- Bouton "Accepter" désactivé
```

### 6. Tests de Géolocalisation

#### Test 17 : Permissions localisation
```
1. Premier lancement app
2. Permissions demandées
Résultat attendu: Pop-up système de permission
```

#### Test 18 : Position sur carte
- [ ] Position de l'agent affichée (marker vert)
- [ ] Position de l'alerte affichée (marker rouge)
- [ ] Carte centrée correctement

#### Test 19 : Calcul de distance
- [ ] Badge distance affiché
- [ ] Distance cohérente (mètres/km)

#### Test 20 : Zoom automatique
- [ ] Carte ajuste le zoom pour voir les 2 markers
- [ ] Padding correct

### 7. Tests du Profil

#### Test 21 : Affichage profil
- [ ] Avatar avec initiales
- [ ] Nom complet
- [ ] Rôle correct
- [ ] Email correct
- [ ] Téléphone affiché

#### Test 22 : Statistiques
- [ ] Total interventions
- [ ] Interventions complétées
- [ ] Chiffres cohérents

### 8. Tests des Paramètres

#### Test 23 : Toggle 2FA
```
1. Désactiver 2FA
Résultat attendu: 
- Switch off
- Prochaine connexion sans OTP (si pas admin)
```

#### Test 24 : Déconnexion
```
1. Clic "Se déconnecter"
2. Confirmer
Résultat attendu:
- Pop-up confirmation
- Redirection vers login
- Tokens supprimés
```

### 9. Tests de Performance

#### Test 25 : Chargement initial
- [ ] Temps < 3 secondes

#### Test 26 : Rafraîchissement alertes
- [ ] Temps < 2 secondes

#### Test 27 : Fluidité navigation
- [ ] Pas de freeze
- [ ] Animations fluides (60 fps)

#### Test 28 : Consommation mémoire
- [ ] RAM < 200 MB

### 10. Tests d'Erreurs

#### Test 29 : Backend hors ligne
```
1. Arrêter Docker backend
2. Essayer de se connecter
Résultat attendu: Message d'erreur réseau
```

#### Test 30 : Token expiré
```
1. Se connecter
2. Attendre expiration (15 min)
3. Faire une action
Résultat attendu: Refresh token automatique
```

#### Test 31 : Pas de connexion Internet
```
1. Désactiver WiFi/Data
2. Ouvrir app
Résultat attendu: Message "Pas de connexion"
```

### 11. Tests sur Device Réel

#### Test 32 : Notifications Push (OneSignal)
```
1. Installer app sur device
2. Accepter permissions notifications
3. Envoyer notification test depuis OneSignal
Résultat attendu: Notification reçue
```

#### Test 33 : GPS réel
```
1. Se déplacer physiquement
2. Vérifier position mise à jour sur carte
```

#### Test 34 : Navigation réelle
```
1. Accepter intervention
2. Lancer navigation
3. Suivre itinéraire Google Maps
```

### 12. Tests d'UI/UX

#### Test 35 : Responsive
- [ ] Portrait OK
- [ ] Landscape OK
- [ ] Différentes tailles écran

#### Test 36 : Thème
- [ ] Couleurs cohérentes
- [ ] Contraste lisible
- [ ] Icônes claires

#### Test 37 : Textes
- [ ] Pas de débordement
- [ ] Ellipsis sur textes longs
- [ ] Langue cohérente (français)

## 📊 Résultats Attendus

### Avant de valider :
- ✅ 35/37 tests passent (minimum)
- ✅ Aucun crash critique
- ✅ Workflow intervention complet fonctionne
- ✅ Authentification sécurisée
- ✅ Géolocalisation précise

### Problèmes connus à corriger :
1. Extraire lat/lng réels depuis `alert.localisation` (actuellement hardcodé)
2. Édition profil non implémentée
3. Changement mot de passe non implémenté

## 🚀 Commandes de Test

```bash
# Lancer l'app en mode debug
flutter run

# Lancer avec logs détaillés
flutter run --verbose

# Build de test
flutter build apk --debug

# Vérifier les performances
flutter run --profile

# Analyser le code
flutter analyze

# Formater le code
flutter format .
```

## 📝 Rapport de Test

Après avoir effectué tous les tests, remplir :

```
Date: _____________
Testeur: _____________
Device: _____________
OS Version: _____________

Tests réussis: ____ / 37
Tests échoués: ____ / 37
Bugs critiques: ____
Bugs mineurs: ____

Commentaires:
________________________________
________________________________
```
