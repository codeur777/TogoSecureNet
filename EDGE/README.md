# Togo SecureNet - Simulateur de Caméras

Ce dossier contient les outils pour simuler le comportement des caméras intelligentes (Edge) déployées sur le terrain.

## Comment tester le système complet ?

1. **Préparer le sujet :**
   - Ouvrez le Dashboard Web (`http://localhost:5173`).
   - Allez dans **Gestion des Personnes**.
   - Cliquez sur **Nouvelle Fiche** et enregistrez une personne avec une photo claire (ex: `visage_jean.jpg`).
   
2. **Lancer la simulation :**
   - Assurez-vous d'avoir l'image dans le dossier `BACKEND/uploads/persons/`.
   - Exécutez le script depuis votre machine hôte :
     ```bash
     python EDGE/simulator.py
     ```
   - Entrez le nom de l'image (ex: `visage_jean.jpg`) quand le script le demande.

3. **Observer le résultat :**
   - Le simulateur envoie un message MQTT à EMQX.
   - Le Backend reçoit le message, analyse l'image avec l'IA.
   - Si la correspondance est trouvée, vous verrez une **Alerte Critique (Toast rouge)** s'afficher instantanément sur votre tableau de bord web.
   - L'historique des alertes sera mis à jour.

## Prérequis
- `paho-mqtt` installé sur votre machine : `pip install paho-mqtt`
