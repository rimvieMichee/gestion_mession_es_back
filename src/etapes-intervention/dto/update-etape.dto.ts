import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StatutEtape } from '../../../generated/prisma/enums';

export class UpdateEtapeDto {
  /** Nouveau statut de l'étape (A_FAIRE, EN_COURS, TERMINEE) */
  @ApiPropertyOptional({ enum: StatutEtape, example: StatutEtape.TERMINEE })
  @IsOptional()
  @IsEnum(StatutEtape)
  statut?: StatutEtape;

  /** Ce que le technicien a fait/constaté pour cette étape */
  @ApiPropertyOptional({ example: 'Onduleur remplacé, tests OK.' })
  @IsOptional()
  @IsString()
  commentaire?: string;
}
