import { ApiProperty } from '@nestjs/swagger';

export class PieceJointeEntity {
  @ApiProperty({ example: 1 })
  id: number;

  /** Type de fichier joint */
  @ApiProperty({ example: 'Photo' })
  typeFichier: string;

  /** Chemin ou URL de stockage du fichier */
  @ApiProperty({
    example: 'https://storage.sahelys.com/interventions/INT-2026-00042/photo-avant.jpg',
  })
  chemin: string;

  @ApiProperty({ example: '2026-09-14T11:28:33.253Z' })
  dateAjout: Date;

  /** Intervention concernée */
  @ApiProperty({ example: 1, description: 'id_intervention' })
  interventionId: number;
}
