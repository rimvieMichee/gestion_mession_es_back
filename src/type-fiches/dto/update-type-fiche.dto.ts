import { PartialType } from '@nestjs/swagger';
import { CreateTypeFicheDto } from './create-type-fiche.dto';

export class UpdateTypeFicheDto extends PartialType(CreateTypeFicheDto) {}
