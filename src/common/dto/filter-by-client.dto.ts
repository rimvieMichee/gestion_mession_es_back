import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FilterByClientDto {
  /** Filtrer la liste sur un client précis (ignoré pour un profil Client, qui est toujours restreint au sien) */
  @ApiPropertyOptional({ example: 1, description: 'id_client' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  clientId?: number;
}
