import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EquipementEntity {
  @ApiProperty({ example: 1 })
  id: number;

  /** Désignation de l'équipement */
  @ApiProperty({ example: 'Serveur de facturation' })
  nom: string;

  /** Catégorie d'équipement */
  @ApiProperty({ example: 'Serveur' })
  typeEquipement: string;

  /** Numéro de série */
  @ApiPropertyOptional({ type: String, example: 'SN-BF-2026-0451', nullable: true })
  numeroSerie: string | null;

  /** Client propriétaire */
  @ApiProperty({ example: 1, description: 'id_client' })
  clientId: number;

  /** Site où se trouve l'équipement */
  @ApiPropertyOptional({ type: Number, example: 1, description: 'id_site', nullable: true })
  siteId: number | null;
}
