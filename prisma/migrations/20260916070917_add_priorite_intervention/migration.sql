-- CreateEnum
CREATE TYPE "PrioriteIntervention" AS ENUM ('NORMALE', 'URGENTE', 'CRITIQUE');

-- AlterTable
ALTER TABLE "intervention" ADD COLUMN     "priorite" "PrioriteIntervention";
