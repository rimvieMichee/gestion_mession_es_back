import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TypeMouvementStock } from '../../../generated/prisma/enums';

export class MouvementStockEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1, description: 'id_materiel' })
  materielId: number;

  @ApiProperty({ enum: TypeMouvementStock, example: TypeMouvementStock.SORTIE })
  type: TypeMouvementStock;

  @ApiProperty({ example: 2 })
  quantite: number;

  @ApiPropertyOptional({ type: String, example: "Utilisation lors de l'intervention INT-2026-00042", nullable: true })
  motif: string | null;

  @ApiPropertyOptional({ type: Number, example: 1, description: 'id_intervention', nullable: true })
  interventionId: number | null;

  @ApiProperty({ example: '2026-09-14T10:45:23.564Z' })
  createdAt: Date;
}
