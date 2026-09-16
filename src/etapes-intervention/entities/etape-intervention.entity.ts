import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatutEtape } from '../../../generated/prisma/enums';
import { PieceJointeEntity } from '../../pieces-jointes/entities/piece-jointe.entity';

export class EtapeInterventionEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1, description: 'id_intervention' })
  interventionId: number;

  @ApiProperty({ example: 1, description: 'Ordre d’affichage (1, 2, 3...)' })
  ordre: number;

  @ApiProperty({ example: 'Début' })
  titre: string;

  @ApiProperty({ enum: StatutEtape, example: StatutEtape.A_FAIRE })
  statut: StatutEtape;

  @ApiPropertyOptional({ example: 'Onduleur remplacé, tests OK.' })
  commentaire: string | null;

  @ApiPropertyOptional({ example: '2026-09-16T09:30:00.000Z' })
  dateRealisation: Date | null;

  @ApiProperty({ type: [PieceJointeEntity] })
  piecesJointes: PieceJointeEntity[];

  @ApiProperty({ example: '2026-09-16T08:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-09-16T09:30:00.000Z' })
  updatedAt: Date;
}
