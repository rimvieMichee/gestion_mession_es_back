import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { STAFF_MANAGER_ROLES } from '../common/constants/roles.constant';
import { SuccessResponseEntity } from '../common/entities/success-response.entity';
import { CreateMaterielDto } from './dto/create-materiel.dto';
import { UpdateMaterielDto } from './dto/update-materiel.dto';
import { CreateMouvementStockDto } from './dto/create-mouvement-stock.dto';
import { MaterielEntity } from './entities/materiel.entity';
import { MouvementStockEntity } from './entities/mouvement-stock.entity';
import { MaterielsService } from './materiels.service';

@ApiTags('Matériel & stock')
@ApiBearerAuth('JWT-auth')
@Controller('materiels')
export class MaterielsController {
  constructor(private readonly materielsService: MaterielsService) {}

  @Post()
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: 'Ajouter une pièce/un consommable au référentiel de stock' })
  @ApiCreatedResponse({ type: MaterielEntity })
  create(@Body() dto: CreateMaterielDto): Promise<MaterielEntity> {
    return this.materielsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister le matériel en stock' })
  @ApiOkResponse({ type: [MaterielEntity] })
  findAll(): Promise<MaterielEntity[]> {
    return this.materielsService.findAll();
  }

  @Get('critical')
  @ApiOperation({ summary: 'Lister le matériel dont le stock est au niveau ou en dessous du seuil minimal' })
  @ApiOkResponse({ type: [MaterielEntity] })
  findCritical(): Promise<MaterielEntity[]> {
    return this.materielsService.findCritical();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulter une fiche matériel' })
  @ApiOkResponse({ type: MaterielEntity })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<MaterielEntity> {
    return this.materielsService.findOne(id);
  }

  @Patch(':id')
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: 'Mettre à jour une fiche matériel' })
  @ApiOkResponse({ type: MaterielEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMaterielDto,
  ): Promise<MaterielEntity> {
    return this.materielsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: 'Retirer un matériel du référentiel' })
  @ApiOkResponse({ type: SuccessResponseEntity })
  remove(@Param('id', ParseIntPipe) id: number): Promise<SuccessResponseEntity> {
    return this.materielsService.remove(id);
  }

  @Get(':id/mouvements')
  @ApiOperation({ summary: "Historique des mouvements de stock d'un matériel" })
  @ApiOkResponse({ type: [MouvementStockEntity] })
  findMouvements(@Param('id', ParseIntPipe) id: number): Promise<MouvementStockEntity[]> {
    return this.materielsService.findMouvements(id);
  }

  @Post(':id/mouvements')
  @ApiOperation({
    summary: 'Enregistrer un mouvement de stock (entrée, sortie ou ajustement)',
    description: 'Met à jour le stock actuel en conséquence ; une sortie est refusée si le stock est insuffisant.',
  })
  @ApiCreatedResponse({ type: MouvementStockEntity })
  createMouvement(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateMouvementStockDto,
  ): Promise<MouvementStockEntity> {
    return this.materielsService.createMouvement(id, dto);
  }
}
