import { Body, Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { UpdateEtapeDto } from './dto/update-etape.dto';
import { EtapeInterventionEntity } from './entities/etape-intervention.entity';
import { EtapesInterventionService } from './etapes-intervention.service';

@ApiTags('Étapes de mission')
@ApiBearerAuth('JWT-auth')
@Controller('interventions/:interventionId/etapes')
export class EtapesInterventionController {
  constructor(private readonly etapesInterventionService: EtapesInterventionService) {}

  @Get()
  @ApiOperation({ summary: "Lister les étapes d'une mission (Début / En cours / Terminé)" })
  @ApiOkResponse({ type: [EtapeInterventionEntity] })
  findAll(
    @Param('interventionId', ParseIntPipe) interventionId: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<EtapeInterventionEntity[]> {
    return this.etapesInterventionService.findAll(interventionId, user);
  }

  @Patch(':etapeId')
  @ApiOperation({
    summary: "Renseigner le statut/commentaire d'une étape",
    description:
      "Le technicien affecté (ou le responsable/staff) documente ce qu'il a fait pour cette étape. Les photos/documents s'ajoutent via POST .../pieces-jointes/upload avec le même etapeId.",
  })
  @ApiOkResponse({ type: EtapeInterventionEntity })
  update(
    @Param('interventionId', ParseIntPipe) interventionId: number,
    @Param('etapeId', ParseIntPipe) etapeId: number,
    @Body() dto: UpdateEtapeDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<EtapeInterventionEntity> {
    return this.etapesInterventionService.update(interventionId, etapeId, dto, user);
  }
}
