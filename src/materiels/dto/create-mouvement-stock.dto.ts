import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { TypeMouvementStock } from '../../../generated/prisma/enums';

export class CreateMouvementStockDto {
  /** Sens du mouvement */
  @ApiProperty({ enum: TypeMouvementStock, example: TypeMouvementStock.SORTIE })
  @IsEnum(TypeMouvementStock)
  type: TypeMouvementStock;

  /** Quantité concernée (toujours positive, le sens est donné par [type]) */
  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  quantite: number;

  /** Motif du mouvement */
  @ApiPropertyOptional({ example: "Utilisation lors de l'intervention INT-2026-00042" })
  @IsOptional()
  @IsString()
  motif?: string;

  /** Intervention à l'origine du mouvement (optionnel) */
  @ApiPropertyOptional({ example: 1, description: 'id_intervention' })
  @IsOptional()
  @IsInt()
  interventionId?: number;
}
