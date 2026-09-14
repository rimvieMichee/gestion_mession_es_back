import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateInterventionDto } from './create-intervention.dto';

export class UpdateInterventionDto extends PartialType(
  OmitType(CreateInterventionDto, ['technicienIds'] as const),
) {}
