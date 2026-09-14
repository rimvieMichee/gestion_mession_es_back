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
import { ROLES } from '../common/constants/roles.constant';
import { SuccessResponseEntity } from '../common/entities/success-response.entity';
import { CreateTypeFicheDto } from './dto/create-type-fiche.dto';
import { UpdateTypeFicheDto } from './dto/update-type-fiche.dto';
import { TypeFicheEntity } from './entities/type-fiche.entity';
import { TypeFichesService } from './type-fiches.service';

@ApiTags('Types de fiche')
@ApiBearerAuth('JWT-auth')
@Controller('type-fiches')
export class TypeFichesController {
  constructor(private readonly typeFichesService: TypeFichesService) {}

  @Post()
  @Roles(ROLES.ADMINISTRATEUR)
  @ApiOperation({ summary: "Créer un type de fiche d'intervention" })
  @ApiCreatedResponse({ type: TypeFicheEntity })
  create(@Body() dto: CreateTypeFicheDto): Promise<TypeFicheEntity> {
    return this.typeFichesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les types de fiche disponibles, avec leurs champs personnalisés' })
  @ApiOkResponse({ type: [TypeFicheEntity] })
  findAll(): Promise<TypeFicheEntity[]> {
    return this.typeFichesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulter un type de fiche' })
  @ApiOkResponse({ type: TypeFicheEntity })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<TypeFicheEntity> {
    return this.typeFichesService.findOne(id);
  }

  @Patch(':id')
  @Roles(ROLES.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Mettre à jour un type de fiche' })
  @ApiOkResponse({ type: TypeFicheEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTypeFicheDto,
  ): Promise<TypeFicheEntity> {
    return this.typeFichesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(ROLES.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Supprimer un type de fiche' })
  @ApiOkResponse({ type: SuccessResponseEntity })
  remove(@Param('id', ParseIntPipe) id: number): Promise<SuccessResponseEntity> {
    return this.typeFichesService.remove(id);
  }
}
