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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { SuccessResponseEntity } from '../common/entities/success-response.entity';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { IncidentEntity } from './entities/incident.entity';
import { IncidentsService } from './incidents.service';

@ApiTags('Incidents')
@ApiBearerAuth('JWT-auth')
@Controller('interventions/:interventionId/incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  @ApiOperation({ summary: "Signaler un incident constaté lors d'une intervention" })
  @ApiCreatedResponse({ type: IncidentEntity })
  create(
    @Param('interventionId', ParseIntPipe) interventionId: number,
    @Body() dto: CreateIncidentDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<IncidentEntity> {
    return this.incidentsService.create(interventionId, dto, user);
  }

  @Get()
  @ApiOperation({ summary: "Lister les incidents d'une intervention" })
  @ApiOkResponse({ type: [IncidentEntity] })
  findAll(
    @Param('interventionId', ParseIntPipe) interventionId: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<IncidentEntity[]> {
    return this.incidentsService.findAll(interventionId, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulter un incident' })
  @ApiOkResponse({ type: IncidentEntity })
  findOne(
    @Param('interventionId', ParseIntPipe) interventionId: number,
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<IncidentEntity> {
    return this.incidentsService.findOne(interventionId, id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Mettre à jour un incident (statut, criticité...)" })
  @ApiOkResponse({ type: IncidentEntity })
  update(
    @Param('interventionId', ParseIntPipe) interventionId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateIncidentDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<IncidentEntity> {
    return this.incidentsService.update(interventionId, id, dto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un incident' })
  @ApiOkResponse({ type: SuccessResponseEntity })
  remove(
    @Param('interventionId', ParseIntPipe) interventionId: number,
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<SuccessResponseEntity> {
    return this.incidentsService.remove(interventionId, id, user);
  }
}
