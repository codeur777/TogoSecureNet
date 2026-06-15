# ─────────────────────────────────────────────
#  Togo SecureNet – Backend (FastAPI / Python)
# ─────────────────────────────────────────────
FROM python:3.11-slim

# Éviter les prompts interactifs apt
ENV DEBIAN_FRONTEND=noninteractive
# Forcer OpenCV en mode headless (sans GUI)
ENV QT_QPA_PLATFORM=offscreen
ENV OPENCV_VIDEOIO_PRIORITY_MSMF=0

# Dépendances système nécessaires
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    cmake \
    build-essential \
    libpq-dev \
    curl \
    # Dépendances pour OpenCV headless + InsightFace
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libgl1 \
    libglvnd0 \
    libxcb1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copier et installer les dépendances Python d'abord (cache Docker)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste du code
COPY . .

# Exposer le port FastAPI
EXPOSE 8000

# Démarrage avec uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
