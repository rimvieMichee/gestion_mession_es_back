import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApplicationEntity {
  @ApiProperty({ example: 1 })
  id: number;

  /** Nom de l'application */
  @ApiProperty({ example: 'Portail Client ONEA' })
  nom: string;

  /** Version courante */
  @ApiPropertyOptional({ type: String, example: '2.3.1', nullable: true })
  version: string | null;

  /** Client concerné */
  @ApiProperty({ example: 1, description: 'id_client' })
  clientId: number;
}
