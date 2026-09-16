import { Module } from '@nestjs/common';
import { EtapesInterventionController } from './etapes-intervention.controller';
import { EtapesInterventionService } from './etapes-intervention.service';

@Module({
  controllers: [EtapesInterventionController],
  providers: [EtapesInterventionService],
})
export class EtapesInterventionModule {}
