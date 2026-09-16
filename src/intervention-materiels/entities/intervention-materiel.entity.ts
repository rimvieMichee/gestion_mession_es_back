import { ApiProperty } from '@nestjs/swagger';
import { MaterielEntity } from '../../materiels/entities/materiel.entity';
import { TypeMouvementStock } from '../../../generated/prisma/enums';

/** Un mouvement de stock (sortie) rattaché à une intervention, avec le détail du matériel. */
export class InterventionMaterielEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1, description: 'id_materiel' })
  materielId: number;

  @ApiProperty({ enum: TypeMouvementStock, example: TypeMouvementStock.SORTIE })
  type: TypeMouvementStock;

  @ApiProperty({ example: 2 })
  quantite: number;

  @ApiProperty({ type: String, nullable: true, example: 'Remplacement onduleur défectueux' })
  motif: string | null;

  @ApiProperty({ example: 1, description: 'id_intervention' })
  interventionId: number;

  @ApiProperty({ example: '2026-09-16T10:45:23.564Z' })
  createdAt: Date;

  @ApiProperty({ type: MaterielEntity })
  materiel: MaterielEntity;
}
