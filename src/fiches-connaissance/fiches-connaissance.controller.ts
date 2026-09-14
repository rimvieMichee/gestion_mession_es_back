import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { CreateFicheConnaissanceDto } from './dto/create-fiche-connaissance.dto';
import { UpdateFicheConnaissanceDto } from './dto/update-fiche-connaissance.dto';
import { FicheConnaissanceEntity } from './entities/fiche-connaissance.entity';
import { FichesConnaissanceService } from './fiches-connaissance.service';

@ApiTags('Base de connaissances')
@ApiBearerAuth('JWT-auth')
@Controller('interventions/:interventionId/fiche-connaissance')
export class InterventionFicheConnaissanceController {
  constructor(private readonly fichesConnaissanceService: FichesConnaissanceService) {}

  @Post()
  @ApiOperation({
    summary: "Capitaliser une intervention en fiche de connaissance réutilisable",
    description: 'Une seule fiche de connaissance autorisée par intervention.',
  })
  @ApiCreatedResponse({ type: FicheConnaissanceEntity })
  create(
    @Param('interventionId', ParseIntPipe) interventionId: number,
    @Body() dto: CreateFicheConnaissanceDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<FicheConnaissanceEntity> {
    return this.fichesConnaissanceService.create(interventionId, dto, user);
  }

  @Get()
  @ApiOperation({ summary: "Consulter la fiche de connaissance d'une intervention" })
  @ApiOkResponse({ type: FicheConnaissanceEntity })
  findForIntervention(
    @Param('interventionId', ParseIntPipe) interventionId: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<FicheConnaissanceEntity> {
    return this.fichesConnaissanceService.findForIntervention(interventionId, user);
  }

  @Patch()
  @ApiOperation({ summary: 'Mettre à jour la fiche de connaissance' })
  @ApiOkResponse({ type: FicheConnaissanceEntity })
  update(
    @Param('interventionId', ParseIntPipe) interventionId: number,
    @Body() dto: UpdateFicheConnaissanceDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<FicheConnaissanceEntity> {
    return this.fichesConnaissanceService.update(interventionId, dto, user);
  }
}
