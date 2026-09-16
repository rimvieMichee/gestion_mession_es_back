import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationEntity } from '../../applications/entities/application.entity';
import { ChampPersonnaliseEntity } from '../../champs-personnalises/entities/champ-personnalise.entity';
import { ClientEntity } from '../../clients/entities/client.entity';
import { ContratEntity } from '../../contrats/entities/contrat.entity';
import { PieceJointeEntity } from '../../pieces-jointes/entities/piece-jointe.entity';
import { ProjetEntity } from '../../projets/entities/projet.entity';
import { SignatureEntity } from '../../signatures/entities/signature.entity';
import { SiteEntity } from '../../sites/entities/site.entity';
import { TypeFicheEntity } from '../../type-fiches/entities/type-fiche.entity';
import {
  ModeIntervention,
  NatureIntervention,
  NiveauCriticite,
  PrioriteIntervention,
  StatutIntervention,
} from '../../../generated/prisma/enums';

class UtilisateurSummaryEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Kaboré' })
  nom: string;

  @ApiProperty({ example: 'Awa' })
  prenom: string;

  @ApiPropertyOptional({ example: 'awa.kabore@sahelys.com' })
  email?: string;
}

class InterventionTechnicienEntity {
  @ApiProperty({ example: 1, description: 'id_intervention' })
  interventionId: number;

  @ApiProperty({ example: 3, description: 'id_technicien' })
  technicienId: number;

  @ApiPropertyOptional({ type: String, example: 'Intervenant principal', nullable: true })
  roleSurIntervention: string | null;

  @ApiProperty({ type: UtilisateurSummaryEntity })
  technicien: UtilisateurSummaryEntity;
}

class ValeurChampEntity {
  @ApiProperty({ example: 1 })
  id: number;

  /** Valeur saisie */
  @ApiProperty({ example: 'SN-BF-2026-0999' })
  valeur: string;

  @ApiProperty({ example: 1, description: 'id_intervention' })
  interventionId: number;

  @ApiProperty({ example: 1, description: 'id_champ' })
  champId: number;

  @ApiProperty({ type: ChampPersonnaliseEntity })
  champ: ChampPersonnaliseEntity;
}

class HistoriqueStatutEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ enum: StatutIntervention, example: StatutIntervention.CLOTUREE })
  statut: StatutIntervention;

  @ApiProperty({ example: '2026-09-14T11:11:58.000Z' })
  dateChangement: Date;

  @ApiProperty({ example: 1, description: 'id_intervention' })
  interventionId: number;

  @ApiProperty({ example: 1, description: 'id_utilisateur' })
  utilisateurId: number;

  @ApiProperty({ type: UtilisateurSummaryEntity })
  utilisateur: UtilisateurSummaryEntity;
}

export class InterventionEntity {
  @ApiProperty({ example: 1 })
  id: number;

  /** Numéro de fiche (généré automatiquement) */
  @ApiProperty({ example: 'INT-2026-00042' })
  numero: string;

  @ApiProperty({ example: '2026-09-15T00:00:00.000Z' })
  date: Date;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2026-09-15T09:00:00.000Z',
    nullable: true,
  })
  heureDebut: Date | null;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2026-09-15T11:30:00.000Z',
    nullable: true,
  })
  heureFin: Date | null;

  /** Durée calculée automatiquement (en heures) */
  @ApiPropertyOptional({ type: Number, example: 2.5, nullable: true })
  duree: number | null;

  @ApiProperty({ enum: ModeIntervention, example: ModeIntervention.SUR_SITE })
  mode: ModeIntervention;

  @ApiProperty({ enum: StatutIntervention, example: StatutIntervention.EN_COURS })
  statut: StatutIntervention;

  /** Objet de l'intervention */
  @ApiProperty({ example: "Panne réseau au siège de l'ONEA" })
  objet: string;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'Coupure internet depuis ce matin' })
  descriptionDemande: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'Redémarrage du switch principal' })
  travauxRealises: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: 'Accès à la baie de brassage retardé',
  })
  difficultesRencontrees: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: 'Le switch de secours mériterait un remplacement',
  })
  observationsTechnicien: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'Client satisfait' })
  observationsClient: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: 'Prévoir le remplacement du switch de secours',
  })
  recommandations: string | null;

  // ⚠️ Champs hors dossier technique d'origine — voir schema.prisma.

  @ApiPropertyOptional({ enum: NatureIntervention, nullable: true, example: NatureIntervention.CURATIVE })
  natureIntervention: NatureIntervention | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'Serveur' })
  typeEquipement: string | null;

  @ApiPropertyOptional({ enum: NiveauCriticite, nullable: true, example: NiveauCriticite.MOYEN })
  niveauRisque: NiveauCriticite | null;

  @ApiPropertyOptional({ enum: PrioriteIntervention, nullable: true, example: PrioriteIntervention.NORMALE })
  priorite: PrioriteIntervention | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'Défaillance électrique' })
  typeDefaillance: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: 'Onduleur hors service depuis plusieurs semaines',
  })
  causeRacine: string | null;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    nullable: true,
    example: '2026-10-01T09:00:00.000Z',
  })
  datePlanifiee: Date | null;

  @ApiProperty({ example: 1, description: 'id_client' })
  clientId: number;

  @ApiProperty({ example: 1, description: 'id_site' })
  siteId: number;

  @ApiPropertyOptional({ type: Number, example: 1, description: 'id_contrat', nullable: true })
  contratId: number | null;

  @ApiPropertyOptional({ type: Number, example: 1, description: 'id_projet', nullable: true })
  projetId: number | null;

  @ApiProperty({ example: 1, description: 'id_type_fiche' })
  typeFicheId: number;

  @ApiProperty({ example: 1, description: 'id_responsable' })
  responsableId: number;

  @ApiProperty({ example: '2026-09-14T11:09:51.476Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-09-14T11:09:51.476Z' })
  updatedAt: Date;

  @ApiProperty({ type: ClientEntity })
  client: ClientEntity;

  @ApiProperty({ type: SiteEntity })
  site: SiteEntity;

  @ApiPropertyOptional({ type: ContratEntity, nullable: true })
  contrat: ContratEntity | null;

  @ApiPropertyOptional({ type: ProjetEntity, nullable: true })
  projet: ProjetEntity | null;

  @ApiProperty({ type: TypeFicheEntity })
  typeFiche: TypeFicheEntity;

  @ApiProperty({ type: UtilisateurSummaryEntity })
  responsable: UtilisateurSummaryEntity;

  @ApiProperty({ type: [InterventionTechnicienEntity] })
  techniciens: InterventionTechnicienEntity[];

  @ApiProperty({ type: [ValeurChampEntity] })
  valeursChamp: ValeurChampEntity[];

  @ApiProperty({ type: [PieceJointeEntity] })
  piecesJointes: PieceJointeEntity[];

  @ApiProperty({ type: [SignatureEntity] })
  signatures: SignatureEntity[];

  @ApiProperty({ type: [HistoriqueStatutEntity] })
  historiqueStatuts: HistoriqueStatutEntity[];
}
