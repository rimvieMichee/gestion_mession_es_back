/*
  Warnings:

  - Added the required column `id_client` to the `plan_maintenance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_responsable` to the `plan_maintenance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_site` to the `plan_maintenance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_type_fiche` to the `plan_maintenance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "plan_maintenance" ADD COLUMN     "id_client" INTEGER NOT NULL,
ADD COLUMN     "id_responsable" INTEGER NOT NULL,
ADD COLUMN     "id_site" INTEGER NOT NULL,
ADD COLUMN     "id_type_fiche" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "plan_maintenance" ADD CONSTRAINT "plan_maintenance_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "client"("id_client") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_maintenance" ADD CONSTRAINT "plan_maintenance_id_site_fkey" FOREIGN KEY ("id_site") REFERENCES "site"("id_site") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_maintenance" ADD CONSTRAINT "plan_maintenance_id_type_fiche_fkey" FOREIGN KEY ("id_type_fiche") REFERENCES "type_fiche"("id_type_fiche") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_maintenance" ADD CONSTRAINT "plan_maintenance_id_responsable_fkey" FOREIGN KEY ("id_responsable") REFERENCES "utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;
