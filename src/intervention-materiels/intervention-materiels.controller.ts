import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { CreateInterventionMaterielDto } from './dto/create-intervention-materiel.dto';
import { InterventionMaterielEntity } from './entities/intervention-materiel.entity';
import { InterventionMaterielsService } from './intervention-materiels.service';

@ApiTags('Matériel & stock')
@ApiBearerAuth('JWT-auth')
@Controller('interventions/:interventionId/materiels')
export class InterventionMaterielsController {
  constructor(private readonly interventionMaterielsService: InterventionMaterielsService) {}

  @Get()
  @ApiOperation({ summary: "Lister le matériel déjà utilisé/prélevé pour cette intervention" })
  @ApiOkResponse({ type: [InterventionMaterielEntity] })
  findAll(
    @Param('interventionId', ParseIntPipe) interventionId: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<InterventionMaterielEntity[]> {
    return this.interventionMaterielsService.findAll(interventionId, user);
  }

  @Post()
  @ApiOperation({
    summary: "Ajouter du matériel à l'intervention",
    description:
      "Prélève la quantité indiquée du stock (refusé si insuffisant). Utilisable par le personnel de pilotage comme par le technicien affecté, qui peut ainsi signaler et ajouter du matériel manquant directement depuis sa fiche mission.",
  })
  @ApiCreatedResponse({ type: InterventionMaterielEntity })
  create(
    @Param('interventionId', ParseIntPipe) interventionId: number,
    @Body() dto: CreateInterventionMaterielDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<InterventionMaterielEntity> {
    return this.interventionMaterielsService.create(interventionId, dto, user);
  }
}
