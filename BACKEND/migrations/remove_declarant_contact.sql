-- Migration: Supprimer la colonne obsolète declarant_contact
-- Date: 2026-06-13
-- Description: Supprime declarant_contact car remplacée par declarant_email et declarant_phone

-- Supprimer la colonne
ALTER TABLE signalements 
DROP COLUMN IF EXISTS declarant_contact;

-- Vérifier que la colonne a été supprimée
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'signalements' 
ORDER BY ordinal_position;
