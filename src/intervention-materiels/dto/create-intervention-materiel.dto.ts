import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateInterventionMaterielDto {
  /** Matériel utilisé/prévu pour cette intervention */
  @ApiProperty({ example: 1, description: 'id_materiel' })
  @IsInt()
  materielId: number;

  /** Quantité prélevée du stock pour cette intervention */
  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  quantite: number;

  /** Motif (ex. "Remplacement pièce défectueuse", "Matériel manquant ajouté par le technicien") */
  @ApiPropertyOptional({ example: 'Remplacement onduleur défectueux' })
  @IsOptional()
  @IsString()
  motif?: string;
}
