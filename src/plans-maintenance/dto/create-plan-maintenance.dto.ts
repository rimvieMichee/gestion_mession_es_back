import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { FrequenceMaintenance } from '../../../generated/prisma/enums';

export class CreatePlanMaintenanceDto {
  /** Nom du plan */
  @ApiProperty({ example: 'Maintenance trimestrielle onduleurs' })
  @IsString()
  nom: string;

  /** Description du plan */
  @ApiProperty({ example: 'Contrôle et remplacement préventif des batteries des onduleurs de salle serveur' })
  @IsString()
  description: string;

  /** Type d'équipement concerné */
  @ApiProperty({ example: 'Onduleur' })
  @IsString()
  typeEquipement: string;

  /** Identifiants des équipements concernés (id_equipement) */
  @ApiPropertyOptional({ type: [String], example: ['1', '2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  equipementIds?: string[];

  /** Sites concernés (nom libre, pas de relation avec Site) */
  @ApiPropertyOptional({ type: [String], example: ['Siège ONEA'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sites?: string[];

  /** Fréquence de récurrence */
  @ApiProperty({ enum: FrequenceMaintenance, example: FrequenceMaintenance.TRIMESTRIEL })
  @IsEnum(FrequenceMaintenance)
  frequence: FrequenceMaintenance;

  /** Date de la prochaine exécution (ISO 8601) */
  @ApiProperty({ example: '2026-10-01' })
  @IsDateString()
  prochaineExecution: string;

  /** Date de la dernière exécution (optionnel) */
  @ApiPropertyOptional({ example: '2026-07-01' })
  @IsOptional()
  @IsDateString()
  derniereExecution?: string;

  /** Plan actif (génère des rappels) */
  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  actif?: boolean;

  /** Durée estimée en heures */
  @ApiProperty({ example: 4 })
  @IsInt()
  @Min(1)
  dureeEstimee: number;

  /** Pièces habituellement nécessaires (texte libre) */
  @ApiPropertyOptional({ type: [String], example: ['Batterie 12V 7Ah'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  piecesRequises?: string[];

  /** Instructions détaillées */
  @ApiProperty({ example: 'Vérifier la tension de charge, remplacer les batteries de plus de 3 ans, tester la bascule secteur/onduleur.' })
  @IsString()
  instructions: string;

  /** Client concerné (nécessaire pour générer une intervention à partir du plan) */
  @ApiProperty({ example: 1, description: 'id_client' })
  @IsInt()
  clientId: number;

  /** Site concerné (doit appartenir au client indiqué) */
  @ApiProperty({ example: 1, description: 'id_site' })
  @IsInt()
  siteId: number;

  /** Type de fiche à utiliser pour l'intervention générée */
  @ApiProperty({ example: 1, description: 'id_type_fiche' })
  @IsInt()
  typeFicheId: number;

  /** Responsable de l'intervention générée */
  @ApiProperty({ example: 1, description: 'id_responsable' })
  @IsInt()
  responsableId: number;
}
