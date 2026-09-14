import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContratEntity {
  @ApiProperty({ example: 1 })
  id: number;

  /** Référence du contrat */
  @ApiProperty({ example: 'CTR-2026-014' })
  reference: string;

  /** Type de SLA associé */
  @ApiPropertyOptional({ type: String, example: 'Standard 8h/5j', nullable: true })
  typeSla: string | null;

  /** Date de début du contrat */
  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  dateDebut: Date;

  /** Date de fin du contrat */
  @ApiProperty({ example: '2026-12-31T00:00:00.000Z' })
  dateFin: Date;

  /** Client concerné */
  @ApiProperty({ example: 1, description: 'id_client' })
  clientId: number;
}
