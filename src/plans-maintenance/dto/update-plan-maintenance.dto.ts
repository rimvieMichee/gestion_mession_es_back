import { PartialType } from '@nestjs/swagger';
import { CreatePlanMaintenanceDto } from './create-plan-maintenance.dto';

export class UpdatePlanMaintenanceDto extends PartialType(CreatePlanMaintenanceDto) {}
