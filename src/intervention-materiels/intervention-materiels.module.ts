import { Module } from '@nestjs/common';
import { MaterielsModule } from '../materiels/materiels.module';
import { InterventionMaterielsController } from './intervention-materiels.controller';
import { InterventionMaterielsService } from './intervention-materiels.service';

@Module({
  imports: [MaterielsModule],
  controllers: [InterventionMaterielsController],
  providers: [InterventionMaterielsService],
})
export class InterventionMaterielsModule {}
