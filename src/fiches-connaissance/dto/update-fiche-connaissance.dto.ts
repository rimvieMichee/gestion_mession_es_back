import { PartialType } from '@nestjs/swagger';
import { CreateFicheConnaissanceDto } from './create-fiche-connaissance.dto';

export class UpdateFicheConnaissanceDto extends PartialType(CreateFicheConnaissanceDto) {}
