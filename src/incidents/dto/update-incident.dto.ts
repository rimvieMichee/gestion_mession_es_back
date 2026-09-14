import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { StatutIncident } from '../../../generated/prisma/enums';
import { CreateIncidentDto } from './create-incident.dto';

export class UpdateIncidentDto extends PartialType(CreateIncidentDto) {
  /** Statut de traitement de l'incident */
  @ApiPropertyOptional({ enum: StatutIncident, example: StatutIncident.EN_COURS })
  @IsOptional()
  @IsEnum(StatutIncident)
  statut?: StatutIncident;
}
