import { Module } from '@nestjs/common';
import { TypeFichesController } from './type-fiches.controller';
import { TypeFichesService } from './type-fiches.service';

@Module({
  controllers: [TypeFichesController],
  providers: [TypeFichesService],
  exports: [TypeFichesService],
})
export class TypeFichesModule {}
