import { Module } from '@nestjs/common';
import { PlansMaintenanceController } from './plans-maintenance.controller';
import { PlansMaintenanceService } from './plans-maintenance.service';

@Module({
  controllers: [PlansMaintenanceController],
  providers: [PlansMaintenanceService],
  exports: [PlansMaintenanceService],
})
export class PlansMaintenanceModule {}
