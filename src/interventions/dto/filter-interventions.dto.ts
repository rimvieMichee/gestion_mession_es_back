import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { StatutIntervention } from '../../../generated/prisma/enums';

export class FilterInterventionsDto {
  /** Filtrer sur un client précis (ignoré pour un profil Client) */
  @ApiPropertyOptional({ example: 1, description: 'id_client' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  clientId?: number;

  /** Filtrer sur un statut précis */
  @ApiPropertyOptional({ enum: StatutIntervention, example: StatutIntervention.EN_COURS })
  @IsOptional()
  @IsEnum(StatutIntervention)
  statut?: StatutIntervention;

  /** Filtrer sur les interventions d'un technicien précis */
  @ApiPropertyOptional({ example: 3, description: 'id_utilisateur du technicien' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  technicienId?: number;
}
