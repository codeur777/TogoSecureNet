-- Mise à jour des signalements sans numéro de suivi
UPDATE signalements 
SET numero_suivi = 'TSN-' || LPAD(CAST(EXTRACT(EPOCH FROM date_declaration)::bigint AS TEXT), 10, '0')
WHERE numero_suivi IS NULL;
