-- Ajout de la colonne must_change_password à la table users
ALTER TABLE users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT FALSE;

-- Mettre must_change_password à TRUE pour tous les utilisateurs non vérifiés
UPDATE users SET must_change_password = TRUE WHERE is_verified = FALSE;

-- Activer 2FA pour tous les utilisateurs non vérifiés
UPDATE users SET two_factor_enabled = TRUE WHERE is_verified = FALSE;
