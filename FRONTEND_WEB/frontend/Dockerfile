# Dockerfile pour le frontend React/Vite
FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port de développement Vite
EXPOSE 5174

# Démarrer le serveur de développement avec --host pour accepter les connexions externes
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5174"]
