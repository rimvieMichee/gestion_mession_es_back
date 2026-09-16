import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { ModeIntervention, NatureIntervention, NiveauCriticite } from '../../../generated/prisma/enums';

export class CreateInterventionDto {
  /** Date de l'intervention (ISO 8601) */
  @ApiProperty({ example: '2026-09-15' })
  @IsDateString()
  date: string;

  /** Intervention sur site ou à distance */
  @ApiProperty({ enum: ModeIntervention, example: ModeIntervention.SUR_SITE })
  @IsEnum(ModeIntervention)
  mode: ModeIntervention;

  /** Objet de l'intervention */
  @ApiProperty({ example: "Panne réseau au siège de l'ONEA" })
  @IsString()
  objet: string;

  /** Description de la demande initiale */
  @ApiPropertyOptional({
    example: "Le client signale une coupure de connexion internet depuis ce matin sur tout le bâtiment.",
  })
  @IsOptional()
  @IsString()
  descriptionDemande?: string;

  /** Client concerné */
  @ApiProperty({ example: 1, description: 'id_client' })
  @IsInt()
  clientId: number;

  /** Site concerné (doit appartenir au même client) */
  @ApiProperty({ example: 1, description: 'id_site' })
  @IsInt()
  siteId: number;

  /** Contrat associé (optionnel) */
  @ApiPropertyOptional({ example: 1, description: 'id_contrat' })
  @IsOptional()
  @IsInt()
  contratId?: number;

  /** Projet associé (optionnel) */
  @ApiPropertyOptional({ example: 1, description: 'id_projet' })
  @IsOptional()
  @IsInt()
  projetId?: number;

  /** Type de fiche utilisé (détermine les champs dynamiques disponibles) */
  @ApiProperty({ example: 1, description: 'id_type_fiche' })
  @IsInt()
  typeFicheId: number;

  /** Utilisateur responsable de l'intervention */
  @ApiProperty({ example: 2, description: 'id_responsable (id_utilisateur)' })
  @IsInt()
  responsableId: number;

  /** Techniciens mobilisés dès la création (optionnel, peut être fait plus tard) */
  @ApiPropertyOptional({ example: [3, 4], description: 'Liste d\'id_utilisateur (techniciens)' })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  technicienIds?: number[];

  // ⚠️ Champs hors dossier technique d'origine (voir schema.prisma), ajoutés
  // pour le formulaire de création de mission du panneau web.

  /** Nature de l'intervention (curative ou préventive) */
  @ApiPropertyOptional({ enum: NatureIntervention, example: NatureIntervention.CURATIVE })
  @IsOptional()
  @IsEnum(NatureIntervention)
  natureIntervention?: NatureIntervention;

  /** Catégorie d'équipement concerné (texte libre, ex. "Serveur", "Poste de travail") */
  @ApiPropertyOptional({ example: 'Serveur' })
  @IsOptional()
  @IsString()
  typeEquipement?: string;

  /** Niveau de risque associé à l'intervention */
  @ApiPropertyOptional({ enum: NiveauCriticite, example: NiveauCriticite.MOYEN })
  @IsOptional()
  @IsEnum(NiveauCriticite)
  niveauRisque?: NiveauCriticite;

  /** Type de défaillance constatée (pertinent pour une intervention curative) */
  @ApiPropertyOptional({ example: 'Défaillance électrique' })
  @IsOptional()
  @IsString()
  typeDefaillance?: string;

  /** Cause racine de la défaillance, si connue */
  @ApiPropertyOptional({ example: 'Onduleur hors service depuis plusieurs semaines' })
  @IsOptional()
  @IsString()
  causeRacine?: string;

  /** Date planifiée (pertinent pour une intervention préventive), ISO 8601 */
  @ApiPropertyOptional({ example: '2026-10-01T09:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  datePlanifiee?: string;
}
