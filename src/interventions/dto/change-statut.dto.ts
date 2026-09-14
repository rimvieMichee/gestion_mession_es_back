import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { StatutIntervention } from '../../../generated/prisma/enums';

export class ChangeStatutDto {
  /** Nouveau statut demandé (doit respecter le cycle de vie, cf. diagramme d'état) */
  @ApiProperty({ enum: StatutIntervention, example: StatutIntervention.PLANIFIEE })
  @IsEnum(StatutIntervention)
  statut: StatutIntervention;
}
