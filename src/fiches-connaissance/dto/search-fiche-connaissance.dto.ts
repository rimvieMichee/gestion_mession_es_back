import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchFicheConnaissanceDto {
  /** Recherche libre sur le problème, le diagnostic ou la solution */
  @ApiPropertyOptional({ example: 'reseau' })
  @IsOptional()
  @IsString()
  search?: string;
}
