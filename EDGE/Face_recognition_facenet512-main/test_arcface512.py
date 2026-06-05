"""
==========================================================================
  TOGOSECURENET — TEST ArcFace 512D (InsightFace + ONNX)
==========================================================================
  SCÉNARIO (identique à la production) :
    1. Ajoute une photo de référence  → vecteur 512D extrait et stocké
    2. La caméra capte le flux vidéo en temps réel
    3. Chaque visage détecté est comparé aux références via cosinus 512D
    4. Résultat : Identifié (vert) ou Inconnu (rouge)

  TOUCHES :
    [A] → Capturer ton visage depuis la caméra comme référence
    [P] → Utiliser un chemin de photo comme référence
    [C] → Effacer toutes les références
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
    import insightface
    from insightface.app import FaceAnalysis
except ImportError:
    print("[ERREUR] insightface non installé. Exécutez : pip install insightface onnxruntime")
    sys.exit(1)

# ── Configuration ───────────────────────────────────────────────────────────
DIR        = os.path.dirname(os.path.abspath(__file__))
EMB_FILE   = os.path.join(DIR, "embeddings", "arcface_references.pkl")
THRESHOLD  = 0.40   # Distance cosinus (plus bas = plus similaire)
DETECT_N   = 10     # Analyser 1 frame toutes les N frames

os.makedirs(os.path.join(DIR, "embeddings"), exist_ok=True)

# ── Initialisation du modèle ArcFace ─────────────────────────────────────
print("[INIT] Chargement du modèle ArcFace 512D... (premier lancement = téléchargement)")
app = FaceAnalysis(
    name="buffalo_s",        # Modèle léger CPU : détection + ArcFace 512D
    providers=["CPUExecutionProvider"]
)
app.prepare(ctx_id=0, det_size=(640, 640))
print("[INIT] Modèle prêt ✅")

# ── Helpers ─────────────────────────────────────────────────────────────────
def cosine_distance(a, b):
    a, b = np.array(a), np.array(b)
    return 1.0 - np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

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

def get_embedding_from_image(img_bgr):
    """Extrait le vecteur 512D ArcFace depuis une image BGR."""
    faces = app.get(img_bgr)
    if not faces:
        return None, "Aucun visage détecté"
    if len(faces) > 1:
        return None, "Plusieurs visages — restez seul"
    return faces[0].embedding, None   # numpy array 512D

def add_from_frame(frame, refs):
    emb, err = get_embedding_from_image(frame)
    if err:
        print(f"[AVERT] {err}. Réessayez.")
        return
    name = input("  → Nom de la personne (référence) : ").strip()
    if not name:
        print("[ERREUR] Nom invalide.")
        return
    refs[name] = emb
    save_references(refs)
    print(f"[OK] Référence '{name}' enregistrée (vecteur 512D ArcFace).")

def add_from_photo(refs):
    path = input("  → Chemin de la photo : ").strip().strip('"')
    if not os.path.exists(path):
        print(f"[ERREUR] Fichier introuvable : {path}")
        return
    img = cv2.imread(path)
    if img is None:
        print("[ERREUR] Impossible de lire l'image.")
        return
    emb, err = get_embedding_from_image(img)
    if err:
        print(f"[AVERT] {err}")
        return
    name = input("  → Nom de la personne : ").strip()
    if not name:
        print("[ERREUR] Nom invalide.")
        return
    refs[name] = emb
    save_references(refs)
    print(f"[OK] Référence '{name}' enregistrée depuis la photo.")

def match_against_refs(embedding, refs):
    """Retourne (nom, distance, matched) par comparaison cosinus 512D."""
    best_name, best_dist = "Inconnu", float("inf")
    for name, ref_emb in refs.items():
        dist = cosine_distance(embedding, ref_emb)
        if dist < best_dist:
            best_dist = dist
            best_name = name
    matched = best_dist < THRESHOLD
    return (best_name if matched else "Inconnu"), best_dist, matched

# ── Programme principal ──────────────────────────────────────────────────────
def main():
    print(__doc__)
    refs = load_references()

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("[ERREUR] Impossible d'ouvrir la caméra.")
        sys.exit(1)

    print("[INFO] Caméra active.")
    print("[INFO] [A]=Capturer  [P]=Photo  [C]=Effacer  [Q]=Quitter\n")

    detected_faces = []  # Liste des résultats à afficher
    frame_count    = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # ── Analyse toutes les N frames ──────────────────────────────────
        if frame_count % DETECT_N == 0:
            detected_faces = []
            try:
                faces = app.get(frame)
                for face in faces:
                    bbox    = face.bbox.astype(int)
                    x1, y1, x2, y2 = bbox[0], bbox[1], bbox[2], bbox[3]
                    emb     = face.embedding

                    if refs:
                        name, dist, matched = match_against_refs(emb, refs)
                        conf  = round((1 - dist) * 100, 1)
                        color = (0, 220, 0) if matched else (0, 0, 220)
                    else:
                        name, conf, color = "? Pas de ref.", 0.0, (0, 165, 255)

                    detected_faces.append((x1, y1, x2, y2, name, conf, color))
            except Exception as e:
                pass

        # ── Affichage ────────────────────────────────────────────────────
        for (x1, y1, x2, y2, name, conf, color) in detected_faces:
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            label = f"{name}  {conf}%" if conf > 0 else name
            cv2.rectangle(frame, (x1, y2 - 28), (x2, y2), color, cv2.FILLED)
            cv2.putText(frame, label, (x1 + 5, y2 - 8),
                        cv2.FONT_HERSHEY_DUPLEX, 0.55, (255, 255, 255), 1)

        # ── HUD ─────────────────────────────────────────────────────────
        hud = f"ArcFace 512D | Refs: {len(refs)} | [A] Camera  [P] Photo  [Q] Quitter"
        cv2.putText(frame, hud, (8, frame.shape[0] - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.42, (200, 200, 200), 1)

        cv2.imshow("TogoSecureNet — ArcFace 512D (InsightFace)", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif key == ord('a'):
            print("\n[CAPTURE] Regardez la caméra, immobile...")
            ret2, snap = cap.read()
            if ret2:
                add_from_frame(snap, refs)
        elif key == ord('p'):
            print()
            add_from_photo(refs)
        elif key == ord('c'):
            refs.clear()
            save_references(refs)
            print("[INFO] Toutes les références effacées.")

        frame_count += 1

    cap.release()
    cv2.destroyAllWindows()
    print("[INFO] Fermeture.")

if __name__ == "__main__":
    main()
