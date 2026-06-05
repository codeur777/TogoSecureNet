"""
==========================================================================
  TOGOSECURENET - TEST FaceNet512 (512D) — Reconnaissance Faciale
==========================================================================
  SCÉNARIO :
    Simule exactement ce que fera le système en production :
    1. Tu ajoutes une photo de référence (la "personne disparue")
    2. La caméra tourne en temps réel
    3. Le système détecte et compare les visages via FaceNet512 (512D)

  TOUCHES :
    [A] → Capturer ton visage depuis la caméra comme référence
    [P] → Utiliser une photo existante comme référence (entre le chemin)
    [C] → Vider toutes les références enregistrées
    [Q] → Quitter
==========================================================================
"""

import cv2
import pickle
import os
import sys
import time
import numpy as np

# ── Dépendances ────────────────────────────────────────────────────────────
try:
    from deepface import DeepFace
    from deepface.modules.verification import find_distance
except ImportError:
    print("[ERREUR] deepface non installé. Exécutez : pip install deepface")
    sys.exit(1)

# ── Configuration ───────────────────────────────────────────────────────────
DIR          = os.path.dirname(os.path.abspath(__file__))
EMB_FILE     = os.path.join(DIR, "embeddings", "test_references.pkl")
MODEL_NAME   = "Facenet512"
THRESHOLD    = 0.78   # Distance euclidean_l2 (seuil de similarité)
DETECT_EVERY = 15     # Analyser 1 frame toutes les N frames

os.makedirs(os.path.join(DIR, "embeddings"), exist_ok=True)

# ── Helpers ─────────────────────────────────────────────────────────────────
def preprocess(img_bgr):
    """Prétraitement CLAHE + normalisation couleur (identique à la prod)."""
    resized  = cv2.resize(img_bgr, (224, 224))
    gray     = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
    clahe    = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)
    return cv2.cvtColor(enhanced, cv2.COLOR_GRAY2RGB)

def extract_embedding(img_bgr):
    """Extrait un vecteur 512D FaceNet512 depuis une image BGR."""
    preprocessed = preprocess(img_bgr)
    result = DeepFace.represent(
        preprocessed,
        model_name=MODEL_NAME,
        enforce_detection=False,
        detector_backend="skip"
    )
    return result[0]["embedding"]

def load_references():
    if os.path.exists(EMB_FILE):
        with open(EMB_FILE, "rb") as f:
            refs = pickle.load(f)
        print(f"[INFO] {len(refs)} référence(s) chargée(s) : {list(refs.keys())}")
        return refs
    print("[INFO] Aucune référence. Appuyez sur [A] ou [P] pour en ajouter.")
    return {}

def save_references(refs):
    with open(EMB_FILE, "wb") as f:
        pickle.dump(refs, f)

def add_from_frame(frame, refs):
    """Capture le visage dans la frame courante et l'ajoute aux références."""
    results = DeepFace.extract_faces(
        frame, detector_backend="opencv", enforce_detection=False
    )
    faces = [r for r in results if r["confidence"] >= 0.5]
    if not faces:
        print("[AVERT] Aucun visage détecté dans la capture. Réessayez.")
        return
    if len(faces) > 1:
        print("[AVERT] Plusieurs visages. Restez seul devant la caméra.")
        return

    fa   = faces[0]["facial_area"]
    crop = frame[fa["y"]:fa["y"]+fa["h"], fa["x"]:fa["x"]+fa["w"]]
    name = input("  → Nom de la personne (référence) : ").strip()
    if not name:
        print("[ERREUR] Nom invalide.")
        return

    emb        = extract_embedding(crop)
    refs[name] = emb
    save_references(refs)
    print(f"[OK] Référence '{name}' enregistrée (vecteur 512D).")

def add_from_photo(refs):
    """Charge une photo depuis le disque et l'ajoute aux références."""
    path = input("  → Chemin de la photo (absolu ou relatif) : ").strip().strip('"')
    if not os.path.exists(path):
        print(f"[ERREUR] Fichier introuvable : {path}")
        return
    img = cv2.imread(path)
    if img is None:
        print("[ERREUR] Impossible de lire l'image.")
        return
    name = input("  → Nom de la personne : ").strip()
    if not name:
        print("[ERREUR] Nom invalide.")
        return

    emb        = extract_embedding(img)
    refs[name] = emb
    save_references(refs)
    print(f"[OK] Référence '{name}' enregistrée depuis la photo.")

def match_face(crop, refs):
    """Compare le crop contre toutes les références. Retourne (nom, distance)."""
    emb     = extract_embedding(crop)
    best_name, best_dist = "Inconnu", float("inf")
    for name, ref_emb in refs.items():
        dist = find_distance(emb, ref_emb, "euclidean_l2")
        if dist < best_dist:
            best_dist = dist
            best_name = name
    if best_dist < THRESHOLD:
        return best_name, best_dist, True
    return "Inconnu", best_dist, False

# ── Programme principal ──────────────────────────────────────────────────────
def main():
    print(__doc__)
    refs = load_references()

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("[ERREUR] Impossible d'ouvrir la caméra.")
        sys.exit(1)

    print("[INFO] Caméra active. [A]=Capturer  [P]=Photo  [C]=Vider  [Q]=Quitter")

    detected_faces = []
    frame_count    = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # ── Analyse toutes les N frames ──────────────────────────────────
        if frame_count % DETECT_EVERY == 0:
            detected_faces = []
            try:
                results = DeepFace.extract_faces(
                    frame, detector_backend="opencv", enforce_detection=False
                )
                for r in results:
                    if r["confidence"] < 0.5:
                        continue
                    fa = r["facial_area"]
                    x, y, w, h = fa["x"], fa["y"], fa["w"], fa["h"]
                    crop = frame[y:y+h, x:x+w]
                    if refs:
                        name, dist, matched = match_face(crop, refs)
                        color = (0, 220, 0) if matched else (0, 0, 220)
                        conf  = round((1 - dist) * 100, 1)
                    else:
                        name, conf, color = "? (pas de référence)", 0, (0, 165, 255)
                    detected_faces.append((x, y, x+w, y+h, name, conf, color))
            except Exception as e:
                pass  # Pas de visage détecté ce cycle

        # ── Affichage des résultats ──────────────────────────────────────
        for (x1, y1, x2, y2, name, conf, color) in detected_faces:
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            label = f"{name} ({conf}%)" if isinstance(conf, float) and conf > 0 else name
            cv2.rectangle(frame, (x1, y2 - 28), (x2, y2), color, cv2.FILLED)
            cv2.putText(frame, label, (x1 + 5, y2 - 8),
                        cv2.FONT_HERSHEY_DUPLEX, 0.55, (255, 255, 255), 1)

        # ── HUD ─────────────────────────────────────────────────────────
        n_refs = len(refs)
        hud = f"FaceNet512 | Refs: {n_refs} | [A] Capturer [P] Photo [Q] Quitter"
        cv2.putText(frame, hud, (8, frame.shape[0]-10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.42, (180, 180, 180), 1)

        cv2.imshow("TogoSecureNet — FaceNet512 (512D)", frame)

        # ── Touches ──────────────────────────────────────────────────────
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif key == ord('a'):
            print("\n[CAPTURE] Immobile...")
            ret2, snap = cap.read()
            if ret2:
                add_from_frame(snap, refs)
        elif key == ord('p'):
            print()
            add_from_photo(refs)
        elif key == ord('c'):
            refs.clear()
            save_references(refs)
            print("[INFO] Toutes les références supprimées.")

        frame_count += 1

    cap.release()
    cv2.destroyAllWindows()
    print("[INFO] Fermeture.")

if __name__ == "__main__":
    main()
