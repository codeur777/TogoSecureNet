-- Migration: Ajouter les champs manquants dans les tables de signalements
-- Date: 2026-06-13

-- ═══════════════════════════════════════════════════════════════════════════
-- Table signalements
-- ═══════════════════════════════════════════════════════════════════════════

-- Ajouter numero_suivi (unique)
ALTER TABLE signalements 
ADD COLUMN IF NOT EXISTS numero_suivi VARCHAR UNIQUE;

-- Ajouter date_validation
ALTER TABLE signalements 
ADD COLUMN IF NOT EXISTS date_validation TIMESTAMP WITH TIME ZONE;

-- Ajouter validateur_id (FK vers users)
ALTER TABLE signalements 
ADD COLUMN IF NOT EXISTS validateur_id VARCHAR REFERENCES users(id);

-- Ajouter motif_rejet
ALTER TABLE signalements 
ADD COLUMN IF NOT EXISTS motif_rejet TEXT;

-- ═══════════════════════════════════════════════════════════════════════════
-- Table engins_voles
-- ═══════════════════════════════════════════════════════════════════════════

-- Ajouter lieu_vol
ALTER TABLE engins_voles 
ADD COLUMN IF NOT EXISTS lieu_vol VARCHAR;

-- Ajouter circonstances (description détaillée du vol)
ALTER TABLE engins_voles 
ADD COLUMN IF NOT EXISTS circonstances TEXT;

-- ═══════════════════════════════════════════════════════════════════════════
-- Créer des index pour améliorer les performances
-- ═══════════════════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_signalements_numero_suivi ON signalements(numero_suivi);
CREATE INDEX IF NOT EXISTS idx_signalements_validateur_id ON signalements(validateur_id);
CREATE INDEX IF NOT EXISTS idx_signalements_date_validation ON signalements(date_validation);

-- ═══════════════════════════════════════════════════════════════════════════
-- Vérification
-- ═══════════════════════════════════════════════════════════════════════════

SELECT 'signalements' as table_name, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'signalements' 
ORDER BY ordinal_position;

SELECT 'engins_voles' as table_name, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'engins_voles' 
ORDER BY ordinal_position;
