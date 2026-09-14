import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchFicheConnaissanceDto } from './dto/search-fiche-connaissance.dto';
import { FicheConnaissanceEntity } from './entities/fiche-connaissance.entity';
import { FichesConnaissanceService } from './fiches-connaissance.service';

@ApiTags('Base de connaissances')
@ApiBearerAuth('JWT-auth')
@Controller('fiches-connaissance')
export class FichesConnaissanceSearchController {
  constructor(private readonly fichesConnaissanceService: FichesConnaissanceService) {}

  @Get()
  @ApiOperation({
    summary: 'Rechercher dans la base de connaissances',
    description: 'Ouvert à tout utilisateur authentifié (technicien inclus).',
  })
  @ApiOkResponse({ type: [FicheConnaissanceEntity] })
  search(@Query() query: SearchFicheConnaissanceDto): Promise<FicheConnaissanceEntity[]> {
    return this.fichesConnaissanceService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulter une fiche de connaissance' })
  @ApiOkResponse({ type: FicheConnaissanceEntity })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<FicheConnaissanceEntity> {
    return this.fichesConnaissanceService.findOne(id);
  }
}
