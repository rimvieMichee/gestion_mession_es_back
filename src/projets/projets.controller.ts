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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { STAFF_MANAGER_ROLES } from '../common/constants/roles.constant';
import { FilterByClientDto } from '../common/dto/filter-by-client.dto';
import { SuccessResponseEntity } from '../common/entities/success-response.entity';
import { CreateProjetDto } from './dto/create-projet.dto';
import { UpdateProjetDto } from './dto/update-projet.dto';
import { ProjetEntity } from './entities/projet.entity';
import { ProjetsService } from './projets.service';

@ApiTags('Projets')
@ApiBearerAuth('JWT-auth')
@Controller('projets')
export class ProjetsController {
  constructor(private readonly projetsService: ProjetsService) {}

  @Post()
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: "Créer un projet d'implémentation/digitalisation pour un client" })
  @ApiCreatedResponse({ type: ProjetEntity })
  create(@Body() dto: CreateProjetDto): Promise<ProjetEntity> {
    return this.projetsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les projets (filtrable par client)' })
  @ApiOkResponse({ type: [ProjetEntity] })
  findAll(
    @Query() query: FilterByClientDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ProjetEntity[]> {
    return this.projetsService.findAll(user, query.clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulter un projet' })
  @ApiOkResponse({ type: ProjetEntity })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ProjetEntity> {
    return this.projetsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: 'Mettre à jour un projet' })
  @ApiOkResponse({ type: ProjetEntity })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjetDto): Promise<ProjetEntity> {
    return this.projetsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: 'Supprimer un projet' })
  @ApiOkResponse({ type: SuccessResponseEntity })
  remove(@Param('id', ParseIntPipe) id: number): Promise<SuccessResponseEntity> {
    return this.projetsService.remove(id);
  }
}
