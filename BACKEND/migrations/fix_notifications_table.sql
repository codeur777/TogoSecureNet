-- Migration: Corriger la table notifications
-- Date: 2026-06-13

-- Ajouter les colonnes manquantes
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS utilisateur_id VARCHAR REFERENCES users(id);

ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS titre VARCHAR;

ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS message TEXT;

ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS lu BOOLEAN DEFAULT FALSE;

ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Créer des index
CREATE INDEX IF NOT EXISTS idx_notifications_utilisateur_id ON notifications(utilisateur_id);
CREATE INDEX IF NOT EXISTS idx_notifications_lu ON notifications(lu);
CREATE INDEX IF NOT EXISTS idx_notifications_date_creation ON notifications(date_creation);

-- Vérification
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;
