import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateProjetDto {
  /** Nom du projet */
  @ApiProperty({ example: 'Digitalisation des relevés de compteurs' })
  @IsString()
  nom: string;

  /** Description du projet */
  @ApiPropertyOptional({
    example: 'Déploiement de tablettes pour les releveurs sur le réseau de Ouagadougou',
  })
  @IsOptional()
  @IsString()
  description?: string;

  /** Date de démarrage (ISO 8601) */
  @ApiProperty({ example: '2026-02-01' })
  @IsDateString()
  dateDebut: string;

  /** Date de fin prévue (ISO 8601) */
  @ApiPropertyOptional({ example: '2026-08-31' })
  @IsOptional()
  @IsDateString()
  dateFin?: string;

  /** Pourcentage d'avancement (0 à 100) */
  @ApiPropertyOptional({ example: 45 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  tauxAvancement?: number;

  /** Client commanditaire */
  @ApiProperty({ example: 1, description: 'id_client' })
  @IsInt()
  clientId: number;
}
