-- Migration: Ajouter le champ user_id à la table signalements
-- Date: 2026-06-12
-- Description: Permet de lier les signalements aux comptes utilisateurs

-- Ajouter la colonne user_id (nullable pour les signalements publics existants)
ALTER TABLE signalements 
ADD COLUMN IF NOT EXISTS user_id VARCHAR REFERENCES users(id);

-- Créer un index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_signalements_user_id ON signalements(user_id);

-- Créer un index sur les contacts pour la recherche lors de l'inscription
CREATE INDEX IF NOT EXISTS idx_signalements_declarant_email ON signalements(declarant_email);
CREATE INDEX IF NOT EXISTS idx_signalements_declarant_phone ON signalements(declarant_phone);

-- Vérifier la migration
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'signalements' AND column_name = 'user_id';
