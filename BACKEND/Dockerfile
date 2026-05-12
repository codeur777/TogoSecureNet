# ─────────────────────────────────────────────
#  Togo SecureNet – Backend (FastAPI / Python)
# ─────────────────────────────────────────────
FROM python:3.11-slim

# Éviter les prompts interactifs apt
ENV DEBIAN_FRONTEND=noninteractive

# Dépendances système nécessaires à psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    cmake \
    build-essential \
    libpq-dev \
    curl \
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
