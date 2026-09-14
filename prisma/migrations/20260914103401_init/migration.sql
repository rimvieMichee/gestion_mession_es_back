-- CreateEnum
CREATE TYPE "StatutIntervention" AS ENUM ('NOUVELLE', 'PLANIFIEE', 'AFFECTEE', 'EN_COURS', 'EN_ATTENTE', 'TERMINEE', 'EN_ATTENTE_VALIDATION_CLIENT', 'VALIDEE', 'CLOTUREE');

-- CreateEnum
CREATE TYPE "ModeIntervention" AS ENUM ('SUR_SITE', 'A_DISTANCE');

-- CreateEnum
CREATE TYPE "NiveauCriticite" AS ENUM ('FAIBLE', 'MOYEN', 'ELEVE', 'CRITIQUE');

-- CreateEnum
CREATE TYPE "StatutIncident" AS ENUM ('OUVERT', 'EN_COURS', 'RESOLU');

-- CreateEnum
CREATE TYPE "TypeSignataire" AS ENUM ('TECHNICIEN', 'CLIENT');

-- CreateTable
CREATE TABLE "client" (
    "id_client" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "secteur_activite" TEXT,
    "email" TEXT,
    "telephone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id_client")
);

-- CreateTable
CREATE TABLE "site" (
    "id_site" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "id_client" INTEGER NOT NULL,

    CONSTRAINT "site_pkey" PRIMARY KEY ("id_site")
);

-- CreateTable
CREATE TABLE "contact" (
    "id_contact" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "fonction" TEXT,
    "email" TEXT,
    "telephone" TEXT,
    "id_client" INTEGER NOT NULL,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id_contact")
);

-- CreateTable
CREATE TABLE "contrat" (
    "id_contrat" SERIAL NOT NULL,
    "reference" TEXT NOT NULL,
    "type_sla" TEXT,
    "date_debut" DATE NOT NULL,
    "date_fin" DATE NOT NULL,
    "id_client" INTEGER NOT NULL,

    CONSTRAINT "contrat_pkey" PRIMARY KEY ("id_contrat")
);

-- CreateTable
CREATE TABLE "projet" (
    "id_projet" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "date_debut" DATE NOT NULL,
    "date_fin" DATE,
    "taux_avancement" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "id_client" INTEGER NOT NULL,

    CONSTRAINT "projet_pkey" PRIMARY KEY ("id_projet")
);

-- CreateTable
CREATE TABLE "equipement" (
    "id_equipement" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "type_equipement" TEXT NOT NULL,
    "numero_serie" TEXT,
    "id_client" INTEGER NOT NULL,
    "id_site" INTEGER,

    CONSTRAINT "equipement_pkey" PRIMARY KEY ("id_equipement")
);

-- CreateTable
CREATE TABLE "application" (
    "id_application" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "version" TEXT,
    "id_client" INTEGER NOT NULL,

    CONSTRAINT "application_pkey" PRIMARY KEY ("id_application")
);

-- CreateTable
CREATE TABLE "role" (
    "id_role" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id_role")
);

-- CreateTable
CREATE TABLE "utilisateur" (
    "id_utilisateur" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "id_role" INTEGER NOT NULL,
    "id_client" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "utilisateur_pkey" PRIMARY KEY ("id_utilisateur")
);

-- CreateTable
CREATE TABLE "type_fiche" (
    "id_type_fiche" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "type_fiche_pkey" PRIMARY KEY ("id_type_fiche")
);

-- CreateTable
CREATE TABLE "champ_personnalise" (
    "id_champ" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,
    "type_donnee" TEXT NOT NULL,
    "obligatoire" BOOLEAN NOT NULL DEFAULT false,
    "id_type_fiche" INTEGER NOT NULL,

    CONSTRAINT "champ_personnalise_pkey" PRIMARY KEY ("id_champ")
);

-- CreateTable
CREATE TABLE "intervention" (
    "id_intervention" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "heure_debut" TIME,
    "heure_fin" TIME,
    "duree" DECIMAL(6,2),
    "mode" "ModeIntervention" NOT NULL,
    "statut" "StatutIntervention" NOT NULL DEFAULT 'NOUVELLE',
    "objet" TEXT NOT NULL,
    "description_demande" TEXT,
    "travaux_realises" TEXT,
    "difficultes_rencontrees" TEXT,
    "observations_technicien" TEXT,
    "observations_client" TEXT,
    "recommandations" TEXT,
    "id_client" INTEGER NOT NULL,
    "id_site" INTEGER NOT NULL,
    "id_contrat" INTEGER,
    "id_projet" INTEGER,
    "id_type_fiche" INTEGER NOT NULL,
    "id_responsable" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "intervention_pkey" PRIMARY KEY ("id_intervention")
);

-- CreateTable
CREATE TABLE "intervention_technicien" (
    "id_intervention" INTEGER NOT NULL,
    "id_technicien" INTEGER NOT NULL,
    "role_sur_intervention" TEXT,

    CONSTRAINT "intervention_technicien_pkey" PRIMARY KEY ("id_intervention","id_technicien")
);

-- CreateTable
CREATE TABLE "valeur_champ" (
    "id_valeur" SERIAL NOT NULL,
    "valeur" TEXT NOT NULL,
    "id_intervention" INTEGER NOT NULL,
    "id_champ" INTEGER NOT NULL,

    CONSTRAINT "valeur_champ_pkey" PRIMARY KEY ("id_valeur")
);

-- CreateTable
CREATE TABLE "piece_jointe" (
    "id_piece_jointe" SERIAL NOT NULL,
    "type_fichier" TEXT NOT NULL,
    "chemin" TEXT NOT NULL,
    "date_ajout" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_intervention" INTEGER NOT NULL,

    CONSTRAINT "piece_jointe_pkey" PRIMARY KEY ("id_piece_jointe")
);

-- CreateTable
CREATE TABLE "signature" (
    "id_signature" SERIAL NOT NULL,
    "type_signataire" "TypeSignataire" NOT NULL,
    "nom_signataire" TEXT NOT NULL,
    "fonction" TEXT,
    "image_signature" TEXT NOT NULL,
    "date_heure" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_intervention" INTEGER NOT NULL,

    CONSTRAINT "signature_pkey" PRIMARY KEY ("id_signature")
);

-- CreateTable
CREATE TABLE "incident" (
    "id_incident" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "niveau_criticite" "NiveauCriticite" NOT NULL,
    "statut" "StatutIncident" NOT NULL DEFAULT 'OUVERT',
    "id_intervention" INTEGER NOT NULL,
    "id_equipement" INTEGER,
    "id_application" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incident_pkey" PRIMARY KEY ("id_incident")
);

-- CreateTable
CREATE TABLE "fiche_connaissance" (
    "id_fiche_connaissance" SERIAL NOT NULL,
    "probleme" TEXT NOT NULL,
    "diagnostic" TEXT NOT NULL,
    "cause" TEXT,
    "solution" TEXT NOT NULL,
    "procedure" TEXT,
    "recommandation" TEXT,
    "id_intervention" INTEGER NOT NULL,
    "id_equipement" INTEGER,
    "id_application" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fiche_connaissance_pkey" PRIMARY KEY ("id_fiche_connaissance")
);

-- CreateTable
CREATE TABLE "notification" (
    "id_notification" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lu" BOOLEAN NOT NULL DEFAULT false,
    "id_utilisateur" INTEGER NOT NULL,
    "id_intervention" INTEGER,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id_notification")
);

-- CreateTable
CREATE TABLE "historique_statut" (
    "id_historique" SERIAL NOT NULL,
    "statut" "StatutIntervention" NOT NULL,
    "date_changement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_intervention" INTEGER NOT NULL,
    "id_utilisateur" INTEGER NOT NULL,

    CONSTRAINT "historique_statut_pkey" PRIMARY KEY ("id_historique")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_libelle_key" ON "role"("libelle");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateur_email_key" ON "utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "intervention_numero_key" ON "intervention"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "valeur_champ_id_intervention_id_champ_key" ON "valeur_champ"("id_intervention", "id_champ");

-- CreateIndex
CREATE UNIQUE INDEX "fiche_connaissance_id_intervention_key" ON "fiche_connaissance"("id_intervention");

-- AddForeignKey
ALTER TABLE "site" ADD CONSTRAINT "site_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "client"("id_client") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "client"("id_client") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contrat" ADD CONSTRAINT "contrat_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "client"("id_client") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projet" ADD CONSTRAINT "projet_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "client"("id_client") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipement" ADD CONSTRAINT "equipement_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "client"("id_client") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipement" ADD CONSTRAINT "equipement_id_site_fkey" FOREIGN KEY ("id_site") REFERENCES "site"("id_site") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "client"("id_client") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "utilisateur" ADD CONSTRAINT "utilisateur_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "role"("id_role") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "utilisateur" ADD CONSTRAINT "utilisateur_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "client"("id_client") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "champ_personnalise" ADD CONSTRAINT "champ_personnalise_id_type_fiche_fkey" FOREIGN KEY ("id_type_fiche") REFERENCES "type_fiche"("id_type_fiche") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention" ADD CONSTRAINT "intervention_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "client"("id_client") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention" ADD CONSTRAINT "intervention_id_site_fkey" FOREIGN KEY ("id_site") REFERENCES "site"("id_site") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention" ADD CONSTRAINT "intervention_id_contrat_fkey" FOREIGN KEY ("id_contrat") REFERENCES "contrat"("id_contrat") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention" ADD CONSTRAINT "intervention_id_projet_fkey" FOREIGN KEY ("id_projet") REFERENCES "projet"("id_projet") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention" ADD CONSTRAINT "intervention_id_type_fiche_fkey" FOREIGN KEY ("id_type_fiche") REFERENCES "type_fiche"("id_type_fiche") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention" ADD CONSTRAINT "intervention_id_responsable_fkey" FOREIGN KEY ("id_responsable") REFERENCES "utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention_technicien" ADD CONSTRAINT "intervention_technicien_id_intervention_fkey" FOREIGN KEY ("id_intervention") REFERENCES "intervention"("id_intervention") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention_technicien" ADD CONSTRAINT "intervention_technicien_id_technicien_fkey" FOREIGN KEY ("id_technicien") REFERENCES "utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valeur_champ" ADD CONSTRAINT "valeur_champ_id_intervention_fkey" FOREIGN KEY ("id_intervention") REFERENCES "intervention"("id_intervention") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valeur_champ" ADD CONSTRAINT "valeur_champ_id_champ_fkey" FOREIGN KEY ("id_champ") REFERENCES "champ_personnalise"("id_champ") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "piece_jointe" ADD CONSTRAINT "piece_jointe_id_intervention_fkey" FOREIGN KEY ("id_intervention") REFERENCES "intervention"("id_intervention") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signature" ADD CONSTRAINT "signature_id_intervention_fkey" FOREIGN KEY ("id_intervention") REFERENCES "intervention"("id_intervention") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident" ADD CONSTRAINT "incident_id_intervention_fkey" FOREIGN KEY ("id_intervention") REFERENCES "intervention"("id_intervention") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident" ADD CONSTRAINT "incident_id_equipement_fkey" FOREIGN KEY ("id_equipement") REFERENCES "equipement"("id_equipement") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident" ADD CONSTRAINT "incident_id_application_fkey" FOREIGN KEY ("id_application") REFERENCES "application"("id_application") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fiche_connaissance" ADD CONSTRAINT "fiche_connaissance_id_intervention_fkey" FOREIGN KEY ("id_intervention") REFERENCES "intervention"("id_intervention") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fiche_connaissance" ADD CONSTRAINT "fiche_connaissance_id_equipement_fkey" FOREIGN KEY ("id_equipement") REFERENCES "equipement"("id_equipement") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fiche_connaissance" ADD CONSTRAINT "fiche_connaissance_id_application_fkey" FOREIGN KEY ("id_application") REFERENCES "application"("id_application") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_id_intervention_fkey" FOREIGN KEY ("id_intervention") REFERENCES "intervention"("id_intervention") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historique_statut" ADD CONSTRAINT "historique_statut_id_intervention_fkey" FOREIGN KEY ("id_intervention") REFERENCES "intervention"("id_intervention") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historique_statut" ADD CONSTRAINT "historique_statut_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;
