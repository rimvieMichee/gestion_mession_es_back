import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FilterChampPersonnaliseDto {
  /** Filtrer les champs sur un type de fiche précis */
  @ApiPropertyOptional({ example: 1, description: 'id_type_fiche' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  typeFicheId?: number;
}
