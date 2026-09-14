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
import { ContratsService } from './contrats.service';
import { CreateContratDto } from './dto/create-contrat.dto';
import { UpdateContratDto } from './dto/update-contrat.dto';
import { ContratEntity } from './entities/contrat.entity';

@ApiTags('Contrats')
@ApiBearerAuth('JWT-auth')
@Controller('contrats')
export class ContratsController {
  constructor(private readonly contratsService: ContratsService) {}

  @Post()
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: 'Créer un contrat / SLA pour un client' })
  @ApiCreatedResponse({ type: ContratEntity })
  create(@Body() dto: CreateContratDto): Promise<ContratEntity> {
    return this.contratsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les contrats (filtrable par client)' })
  @ApiOkResponse({ type: [ContratEntity] })
  findAll(
    @Query() query: FilterByClientDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ContratEntity[]> {
    return this.contratsService.findAll(user, query.clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulter un contrat' })
  @ApiOkResponse({ type: ContratEntity })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ContratEntity> {
    return this.contratsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: 'Mettre à jour un contrat' })
  @ApiOkResponse({ type: ContratEntity })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateContratDto): Promise<ContratEntity> {
    return this.contratsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: 'Supprimer un contrat' })
  @ApiOkResponse({ type: SuccessResponseEntity })
  remove(@Param('id', ParseIntPipe) id: number): Promise<SuccessResponseEntity> {
    return this.contratsService.remove(id);
  }
}
