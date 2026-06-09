# RESTRUCTURATION DE LA BASE DE DONNÉES

## Basé sur le diagramme de classe fourni

### Entités à créer/modifier :

1. ✅ **UTILISATEUR** (User) - Existant, à compléter
   - UUID
   - username, email, motDePasse
   - role: RoleEnum (admin, superviseur, agent, citoyen)
   - estActif: Boolean
   - dateCreation: DateTime

2. **SIGNALEMENT** - À créer
   - UUID
   - declarantNom, typeSignalement (TypeEnum)
   - declarantContact, statut (StatutEnum)
   - dateDeclaration

3. **PERSONNE_D** (PersonneDisparue) - À refactoriser depuis Person
   - UUID
   - nom, prenoms, description
   - age, niveauGravite
   - dateDisparition, lieuDisparition
   - vecteurFacial: List[Float]
   - photo: List[String]

4. **ENGIN_V** (EnginVole) - À créer
   - UUID
   - marque, modele, couleur
   - typeEngin, plaqueImmatriculation
   - dateVol, statut (StatutEnum)

5. **CAMERA** - Existant, à vérifier
   - UUID
   - nom, type (TypeCameraEnum)
   - description, localisation
   - urlFlux, estActive

6. **DETECTION** - À créer
   - UUID
   - dateHeure, scoreConfiance
   - imageCapture, localisation
   - typeDetection (EnumTypeDetection)

7. **ALERTE** - Existant (Alert), à vérifier
   - UUID
   - niveauGravite (GraviteEnum)
   - typeDetection, message
   - estLue, dateEmission

8. **NOTIFICATION** - À créer
   - UUID
   - fournisseurSMS, fournisseurEmail

9. **AUDIT** - À créer
   - UUID
   - action, dateHeure
   - adresseIP, utilisateurId

10. **SYSTEME_IA** - À créer
    - modeleDetectionObjet
    - modeleReconnaissanceFaciale
    - seuilConfiance

### Relations principales :

- UTILISATEUR (1) ---créer---> (0..*) SIGNALEMENT
- UTILISATEUR (1) ---gérer---> (0..*) CAMERA
- UTILISATEUR (0..*) <---envoyer--- (1) ALERTE
- SIGNALEMENT (1) ---engendrer---> (1) PERSONNE_D
- SIGNALEMENT (1) ---engendrer---> (1) ENGIN_V
- CAMERA (1) ---produire---> (0..*) DETECTION
- DETECTION (1) ---rattacher---> (1) PERSONNE_D
- DETECTION (1) ---susciter---> (1) ENGIN_V
- DETECTION (1) ---déclencher---> (1) ALERTE
- ALERTE (1) ---déclencher---> (1) NOTIFICATION
- SYSTEME_IA (1) ---analyser---> (0..*) DETECTION

### Fichiers à créer/modifier :

**Modèles :**
- ✅ `models/signalement.py` - Créé
- `models/person.py` - Refactoriser vers PersonneDisparue
- `models/engin_vole.py` - À créer
- `models/detection.py` - À créer
- `models/notification.py` - À créer  
- `models/audit.py` - À créer
- `models/systeme_ia.py` - À créer
- `models/user.py` - À vérifier/compléter
- `models/camera.py` - À vérifier
- `models/alert.py` - À vérifier

**Schemas Pydantic :**
- `schemas/signalement.py`
- `schemas/personne_disparue.py`
- `schemas/engin_vole.py`
- `schemas/detection.py`
- `schemas/notification.py`
- `schemas/audit.py`

**API Endpoints :**
- `api/signalements.py` - CRUD signalements
- `api/personnes_disparues.py` - Gestion personnes
- `api/engins_voles.py` - Gestion engins
- `api/detections.py` - Historique détections
- `api/notifications.py` - Gestion notifications
- `api/audit.py` - Logs système (existe déjà)

### Priorités :

1. **Phase 1** - Modèles de base
   - Signalement ✅
   - PersonneDisparue
   - EnginVole
   - Detection

2. **Phase 2** - Système d'alertes
   - Alerte (vérifier)
   - Notification
   - Audit

3. **Phase 3** - Intégration IA
   - SystemeIA
   - Reconnaissance faciale
   - Détection d'objets

### Migration :

```bash
# 1. Créer les nouveaux modèles
# 2. Générer une migration Alembic
alembic revision --autogenerate -m "Restructuration selon diagramme de classe"

# 3. Appliquer la migration
alembic upgrade head

# 4. Migrer les données existantes
python migrate_old_data.py
```
