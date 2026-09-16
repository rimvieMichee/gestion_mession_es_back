-- CreateEnum
CREATE TYPE "NatureIntervention" AS ENUM ('CURATIVE', 'PREVENTIVE');

-- AlterTable
ALTER TABLE "intervention" ADD COLUMN     "cause_racine" TEXT,
ADD COLUMN     "date_planifiee" TIMESTAMP(3),
ADD COLUMN     "nature_intervention" "NatureIntervention",
ADD COLUMN     "niveau_risque" "NiveauCriticite",
ADD COLUMN     "type_defaillance" TEXT,
ADD COLUMN     "type_equipement_libre" TEXT;
