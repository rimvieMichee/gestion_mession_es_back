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
import { STAFF_MANAGER_ROLES } from '../common/constants/roles.constant';
import { SuccessResponseEntity } from '../common/entities/success-response.entity';
import { CreatePlanMaintenanceDto } from './dto/create-plan-maintenance.dto';
import { UpdatePlanMaintenanceDto } from './dto/update-plan-maintenance.dto';
import { PlanMaintenanceEntity } from './entities/plan-maintenance.entity';
import { PlansMaintenanceService } from './plans-maintenance.service';

@ApiTags('Plans de maintenance')
@ApiBearerAuth('JWT-auth')
@Controller('plans-maintenance')
@Roles(...STAFF_MANAGER_ROLES)
export class PlansMaintenanceController {
  constructor(private readonly plansMaintenanceService: PlansMaintenanceService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un plan de maintenance préventive récurrent' })
  @ApiCreatedResponse({ type: PlanMaintenanceEntity })
  create(@Body() dto: CreatePlanMaintenanceDto): Promise<PlanMaintenanceEntity> {
    return this.plansMaintenanceService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les plans de maintenance' })
  @ApiOkResponse({ type: [PlanMaintenanceEntity] })
  findAll(): Promise<PlanMaintenanceEntity[]> {
    return this.plansMaintenanceService.findAll();
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Lister les plans actifs dont la prochaine exécution est proche' })
  @ApiOkResponse({ type: [PlanMaintenanceEntity] })
  findUpcoming(@Query('days') days?: string): Promise<PlanMaintenanceEntity[]> {
    return this.plansMaintenanceService.findUpcoming(days ? Number(days) : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulter un plan de maintenance' })
  @ApiOkResponse({ type: PlanMaintenanceEntity })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PlanMaintenanceEntity> {
    return this.plansMaintenanceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un plan de maintenance' })
  @ApiOkResponse({ type: PlanMaintenanceEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePlanMaintenanceDto,
  ): Promise<PlanMaintenanceEntity> {
    return this.plansMaintenanceService.update(id, dto);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Activer/désactiver un plan de maintenance' })
  @ApiOkResponse({ type: PlanMaintenanceEntity })
  toggle(@Param('id', ParseIntPipe) id: number): Promise<PlanMaintenanceEntity> {
    return this.plansMaintenanceService.toggleActif(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un plan de maintenance' })
  @ApiOkResponse({ type: SuccessResponseEntity })
  remove(@Param('id', ParseIntPipe) id: number): Promise<SuccessResponseEntity> {
    return this.plansMaintenanceService.remove(id);
  }
}
