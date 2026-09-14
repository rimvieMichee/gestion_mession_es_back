import { Module } from '@nestjs/common';
import { FichesConnaissanceSearchController } from './fiches-connaissance-search.controller';
import { InterventionFicheConnaissanceController } from './fiches-connaissance.controller';
import { FichesConnaissanceService } from './fiches-connaissance.service';

@Module({
  controllers: [InterventionFicheConnaissanceController, FichesConnaissanceSearchController],
  providers: [FichesConnaissanceService],
})
export class FichesConnaissanceModule {}
