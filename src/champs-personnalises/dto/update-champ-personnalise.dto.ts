import { PartialType } from '@nestjs/swagger';
import { CreateChampPersonnaliseDto } from './create-champ-personnalise.dto';

export class UpdateChampPersonnaliseDto extends PartialType(CreateChampPersonnaliseDto) {}
