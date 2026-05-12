# ─────────────────────────────────────────────
#  Togo SecureNet – Frontend (Vite + React)
# ─────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances en premier (cache Docker)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Exposer le port Vite dev server
EXPOSE 5173

# Démarrage en mode développement avec host 0.0.0.0 pour Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
