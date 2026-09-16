import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { PiecesJointesController } from './pieces-jointes.controller';
import { PiecesJointesService } from './pieces-jointes.service';

@Module({
  imports: [StorageModule],
  controllers: [PiecesJointesController],
  providers: [PiecesJointesService],
})
export class PiecesJointesModule {}
