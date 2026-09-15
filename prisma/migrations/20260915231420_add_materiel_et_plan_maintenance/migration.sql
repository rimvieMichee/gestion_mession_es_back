-- CreateEnum
CREATE TYPE "TypeMouvementStock" AS ENUM ('ENTREE', 'SORTIE', 'AJUSTEMENT');

-- CreateEnum
CREATE TYPE "FrequenceMaintenance" AS ENUM ('HEBDOMADAIRE', 'MENSUEL', 'TRIMESTRIEL', 'ANNUEL');

-- CreateTable
CREATE TABLE "materiel" (
    "id_materiel" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "stock_actuel" INTEGER NOT NULL DEFAULT 0,
    "seuil_min" INTEGER NOT NULL,
    "seuil_max" INTEGER NOT NULL,
    "prix_unitaire" DECIMAL(12,2) NOT NULL,
    "fournisseur" TEXT NOT NULL,
    "emplacement" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "materiel_pkey" PRIMARY KEY ("id_materiel")
);

-- CreateTable
CREATE TABLE "mouvement_stock" (
    "id_mouvement" SERIAL NOT NULL,
    "id_materiel" INTEGER NOT NULL,
    "type" "TypeMouvementStock" NOT NULL,
    "quantite" INTEGER NOT NULL,
    "motif" TEXT,
    "id_intervention" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mouvement_stock_pkey" PRIMARY KEY ("id_mouvement")
);

-- CreateTable
CREATE TABLE "plan_maintenance" (
    "id_plan_maintenance" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type_equipement" TEXT NOT NULL,
    "id_equipements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sites" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "frequence" "FrequenceMaintenance" NOT NULL,
    "prochaine_execution" TIMESTAMP(3) NOT NULL,
    "derniere_execution" TIMESTAMP(3),
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "duree_estimee" INTEGER NOT NULL,
    "pieces_requises" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "instructions" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_maintenance_pkey" PRIMARY KEY ("id_plan_maintenance")
);

-- CreateIndex
CREATE UNIQUE INDEX "materiel_reference_key" ON "materiel"("reference");

-- AddForeignKey
ALTER TABLE "mouvement_stock" ADD CONSTRAINT "mouvement_stock_id_materiel_fkey" FOREIGN KEY ("id_materiel") REFERENCES "materiel"("id_materiel") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mouvement_stock" ADD CONSTRAINT "mouvement_stock_id_intervention_fkey" FOREIGN KEY ("id_intervention") REFERENCES "intervention"("id_intervention") ON DELETE SET NULL ON UPDATE CASCADE;
