import { Module } from '@nestjs/common';
import { ChampsPersonnalisesController } from './champs-personnalises.controller';
import { ChampsPersonnalisesService } from './champs-personnalises.service';

@Module({
  controllers: [ChampsPersonnalisesController],
  providers: [ChampsPersonnalisesService],
  exports: [ChampsPersonnalisesService],
})
export class ChampsPersonnalisesModule {}
