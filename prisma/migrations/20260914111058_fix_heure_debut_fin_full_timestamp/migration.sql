-- Corrige heure_debut/heure_fin : ils doivent porter un timestamp complet
-- (date + heure) et non un simple TIME, sans quoi le calcul de la duree
-- (heureFin - heureDebut) serait faux (les deux valeurs seraient ancrees
-- sur des dates differentes selon le fuseau/epoch de reference).
ALTER TABLE "intervention" ALTER COLUMN "heure_debut" TYPE TIMESTAMP(3) USING NULL;
ALTER TABLE "intervention" ALTER COLUMN "heure_fin" TYPE TIMESTAMP(3) USING NULL;
