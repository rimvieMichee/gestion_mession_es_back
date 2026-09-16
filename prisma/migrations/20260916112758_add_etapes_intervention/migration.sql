-- CreateEnum
CREATE TYPE "StatutEtape" AS ENUM ('A_FAIRE', 'EN_COURS', 'TERMINEE');

-- AlterTable
ALTER TABLE "piece_jointe" ADD COLUMN     "id_etape" INTEGER;

-- CreateTable
CREATE TABLE "etape_intervention" (
    "id_etape" SERIAL NOT NULL,
    "id_intervention" INTEGER NOT NULL,
    "ordre" INTEGER NOT NULL,
    "titre" TEXT NOT NULL,
    "statut" "StatutEtape" NOT NULL DEFAULT 'A_FAIRE',
    "commentaire" TEXT,
    "date_realisation" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "etape_intervention_pkey" PRIMARY KEY ("id_etape")
);

-- CreateIndex
CREATE UNIQUE INDEX "etape_intervention_id_intervention_ordre_key" ON "etape_intervention"("id_intervention", "ordre");

-- AddForeignKey
ALTER TABLE "piece_jointe" ADD CONSTRAINT "piece_jointe_id_etape_fkey" FOREIGN KEY ("id_etape") REFERENCES "etape_intervention"("id_etape") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "etape_intervention" ADD CONSTRAINT "etape_intervention_id_intervention_fkey" FOREIGN KEY ("id_intervention") REFERENCES "intervention"("id_intervention") ON DELETE CASCADE ON UPDATE CASCADE;
