import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FrequenceMaintenance } from '../../../generated/prisma/enums';

export class PlanMaintenanceEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Maintenance trimestrielle onduleurs' })
  nom: string;

  @ApiProperty({ example: 'Contrôle et remplacement préventif des batteries des onduleurs de salle serveur' })
  description: string;

  @ApiProperty({ example: 'Onduleur' })
  typeEquipement: string;

  @ApiProperty({ type: [String], example: ['1', '2'] })
  equipementIds: string[];

  @ApiProperty({ type: [String], example: ['Siège ONEA'] })
  sites: string[];

  @ApiProperty({ enum: FrequenceMaintenance, example: FrequenceMaintenance.TRIMESTRIEL })
  frequence: FrequenceMaintenance;

  @ApiProperty({ example: '2026-10-01T00:00:00.000Z' })
  prochaineExecution: Date;

  @ApiPropertyOptional({ type: String, example: '2026-07-01T00:00:00.000Z', nullable: true })
  derniereExecution: Date | null;

  @ApiProperty({ example: true })
  actif: boolean;

  @ApiProperty({ example: 4 })
  dureeEstimee: number;

  @ApiProperty({ type: [String], example: ['Batterie 12V 7Ah'] })
  piecesRequises: string[];

  @ApiProperty({ example: 'Vérifier la tension de charge, remplacer les batteries de plus de 3 ans...' })
  instructions: string;

  @ApiProperty({ example: 1, description: 'id_client' })
  clientId: number;

  @ApiProperty({ example: 1, description: 'id_site' })
  siteId: number;

  @ApiProperty({ example: 1, description: 'id_type_fiche' })
  typeFicheId: number;

  @ApiProperty({ example: 1, description: 'id_responsable' })
  responsableId: number;

  @ApiProperty({ example: '2026-09-14T10:45:23.564Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-09-14T10:45:23.564Z' })
  updatedAt: Date;
}
