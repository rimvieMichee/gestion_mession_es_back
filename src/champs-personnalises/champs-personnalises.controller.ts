import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { ROLES } from '../common/constants/roles.constant';
import { SuccessResponseEntity } from '../common/entities/success-response.entity';
import { ChampsPersonnalisesService } from './champs-personnalises.service';
import { CreateChampPersonnaliseDto } from './dto/create-champ-personnalise.dto';
import { FilterChampPersonnaliseDto } from './dto/filter-champ-personnalise.dto';
import { UpdateChampPersonnaliseDto } from './dto/update-champ-personnalise.dto';
import { ChampPersonnaliseEntity } from './entities/champ-personnalise.entity';

@ApiTags('Champs personnalisés')
@ApiBearerAuth('JWT-auth')
@Controller('champs-personnalises')
export class ChampsPersonnalisesController {
  constructor(private readonly champsPersonnalisesService: ChampsPersonnalisesService) {}

  @Post()
  @Roles(ROLES.ADMINISTRATEUR)
  @ApiOperation({ summary: "Créer un champ dynamique pour un type de fiche" })
  @ApiCreatedResponse({ type: ChampPersonnaliseEntity })
  create(@Body() dto: CreateChampPersonnaliseDto): Promise<ChampPersonnaliseEntity> {
    return this.champsPersonnalisesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les champs personnalisés (filtrable par type de fiche)' })
  @ApiOkResponse({ type: [ChampPersonnaliseEntity] })
  findAll(@Query() query: FilterChampPersonnaliseDto): Promise<ChampPersonnaliseEntity[]> {
    return this.champsPersonnalisesService.findAll(query.typeFicheId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulter un champ personnalisé' })
  @ApiOkResponse({ type: ChampPersonnaliseEntity })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ChampPersonnaliseEntity> {
    return this.champsPersonnalisesService.findOne(id);
  }

  @Patch(':id')
  @Roles(ROLES.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Mettre à jour un champ personnalisé' })
  @ApiOkResponse({ type: ChampPersonnaliseEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateChampPersonnaliseDto,
  ): Promise<ChampPersonnaliseEntity> {
    return this.champsPersonnalisesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(ROLES.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Supprimer un champ personnalisé' })
  @ApiOkResponse({ type: SuccessResponseEntity })
  remove(@Param('id', ParseIntPipe) id: number): Promise<SuccessResponseEntity> {
    return this.champsPersonnalisesService.remove(id);
  }
}
