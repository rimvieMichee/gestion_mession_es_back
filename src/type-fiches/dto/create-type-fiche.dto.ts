import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateTypeFicheDto {
  /** Nom du type de fiche d'intervention */
  @ApiProperty({ example: 'Maintenance informatique' })
  @IsString()
  libelle: string;

  /** Description du type de fiche */
  @ApiPropertyOptional({
    example: 'Intervention de maintenance sur un poste, serveur ou équipement réseau',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
