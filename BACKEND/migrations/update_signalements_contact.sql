-- Migration: Séparer declarant_contact en declarant_email et declarant_phone
-- Date: 2026-06-12

-- Ajouter les nouvelles colonnes
ALTER TABLE signalements ADD COLUMN IF NOT EXISTS declarant_email VARCHAR;
ALTER TABLE signalements ADD COLUMN IF NOT EXISTS declarant_phone VARCHAR;

-- Copier les données existantes (si c'est un email, sinon téléphone)
UPDATE signalements 
SET declarant_email = declarant_contact 
WHERE declarant_contact LIKE '%@%';

UPDATE signalements 
SET declarant_phone = declarant_contact 
WHERE declarant_contact NOT LIKE '%@%';

-- Supprimer l'ancienne colonne (optionnel, garder pour compatibilité)
-- ALTER TABLE signalements DROP COLUMN IF EXISTS declarant_contact;
