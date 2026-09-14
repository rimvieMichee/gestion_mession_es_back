import { ApiProperty } from '@nestjs/swagger';

export class HealthEntity {
  /** État général de l'API */
  @ApiProperty({ example: 'ok' })
  status: string;

  /** État de la connexion à la base de données */
  @ApiProperty({ example: 'up' })
  database: string;
}
