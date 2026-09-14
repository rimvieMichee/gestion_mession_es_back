import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateEquipementDto {
  /** Désignation de l'équipement */
  @ApiProperty({ example: 'Serveur de facturation' })
  @IsString()
  nom: string;

  /** Catégorie d'équipement */
  @ApiProperty({ example: 'Serveur' })
  @IsString()
  typeEquipement: string;

  /** Numéro de série */
  @ApiPropertyOptional({ example: 'SN-BF-2026-0451' })
  @IsOptional()
  @IsString()
  numeroSerie?: string;

  /** Client propriétaire */
  @ApiProperty({ example: 1, description: 'id_client' })
  @IsInt()
  clientId: number;

  /** Site où se trouve l'équipement (optionnel, doit appartenir au même client) */
  @ApiPropertyOptional({ example: 1, description: 'id_site' })
  @IsOptional()
  @IsInt()
  siteId?: number;
}
