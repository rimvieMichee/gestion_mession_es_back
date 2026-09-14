import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProjetEntity {
  @ApiProperty({ example: 1 })
  id: number;

  /** Nom du projet */
  @ApiProperty({ example: 'Digitalisation des relevés de compteurs' })
  nom: string;

  /** Description du projet */
  @ApiPropertyOptional({
    type: String,
    example: 'Déploiement de tablettes pour les releveurs sur le réseau de Ouagadougou',
    nullable: true,
  })
  description: string | null;

  /** Date de démarrage */
  @ApiProperty({ example: '2026-02-01T00:00:00.000Z' })
  dateDebut: Date;

  /** Date de fin prévue */
  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2026-08-31T00:00:00.000Z',
    nullable: true,
  })
  dateFin: Date | null;

  /** Pourcentage d'avancement */
  @ApiProperty({ example: 45 })
  tauxAvancement: number;

  /** Client commanditaire */
  @ApiProperty({ example: 1, description: 'id_client' })
  clientId: number;
}
