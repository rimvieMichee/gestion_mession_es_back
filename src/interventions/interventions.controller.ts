import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { STAFF_MANAGER_ROLES } from '../common/constants/roles.constant';
import { AssignTechnicienDto } from './dto/assign-technicien.dto';
import { ChangeStatutDto } from './dto/change-statut.dto';
import { CreateInterventionDto } from './dto/create-intervention.dto';
import { FilterInterventionsDto } from './dto/filter-interventions.dto';
import { UpdateCompteRenduDto } from './dto/update-compte-rendu.dto';
import { UpdateInterventionDto } from './dto/update-intervention.dto';
import { UpsertValeursChampDto } from './dto/upsert-valeurs-champ.dto';
import { InterventionEntity } from './entities/intervention.entity';
import { InterventionsService } from './interventions.service';

@ApiTags('Interventions')
@ApiBearerAuth('JWT-auth')
@Controller('interventions')
export class InterventionsController {
  constructor(private readonly interventionsService: InterventionsService) {}

  @Post()
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: "Créer une nouvelle fiche d'intervention (statut initial : Nouvelle)" })
  @ApiCreatedResponse({ type: InterventionEntity })
  create(
    @Body() dto: CreateInterventionDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<InterventionEntity> {
    return this.interventionsService.create(dto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les interventions',
    description:
      "Un Client ne voit que les interventions de son organisation, un Technicien que celles dont il est responsable ou affecté.",
  })
  @ApiOkResponse({ type: [InterventionEntity] })
  findAll(
    @Query() filter: FilterInterventionsDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<InterventionEntity[]> {
    return this.interventionsService.findAll(user, filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulter une intervention (détail complet)' })
  @ApiOkResponse({ type: InterventionEntity })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<InterventionEntity> {
    return this.interventionsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: "Mettre à jour la planification d'une intervention" })
  @ApiOkResponse({ type: InterventionEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInterventionDto,
  ): Promise<InterventionEntity> {
    return this.interventionsService.update(id, dto);
  }

  @Patch(':id/compte-rendu')
  @ApiOperation({
    summary: "Renseigner le compte-rendu (travaux réalisés, difficultés, recommandations...)",
    description: 'Réservé au responsable, aux techniciens affectés, ou au personnel interne.',
  })
  @ApiOkResponse({ type: InterventionEntity })
  updateCompteRendu(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompteRenduDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<InterventionEntity> {
    return this.interventionsService.updateCompteRendu(id, dto, user);
  }

  @Patch(':id/statut')
  @ApiOperation({
    summary: "Faire progresser le statut de l'intervention",
    description:
      "Respecte le cycle de vie du dossier technique : Nouvelle → Planifiée → Affectée → En cours ⇄ En attente → Terminée → En attente de validation client → Validée → Clôturée.",
  })
  @ApiOkResponse({ type: InterventionEntity })
  changeStatut(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeStatutDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<InterventionEntity> {
    return this.interventionsService.changeStatut(id, dto, user);
  }

  @Post(':id/techniciens')
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: "Affecter (ou mettre à jour) un technicien sur l'intervention" })
  @ApiCreatedResponse({ type: InterventionEntity })
  assignTechnicien(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignTechnicienDto,
  ): Promise<InterventionEntity> {
    return this.interventionsService.assignTechnicien(id, dto);
  }

  @Delete(':id/techniciens/:technicienId')
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: "Retirer un technicien de l'intervention" })
  @ApiOkResponse({ type: InterventionEntity })
  unassignTechnicien(
    @Param('id', ParseIntPipe) id: number,
    @Param('technicienId', ParseIntPipe) technicienId: number,
  ): Promise<InterventionEntity> {
    return this.interventionsService.unassignTechnicien(id, technicienId);
  }

  @Put(':id/valeurs-champ')
  @ApiOperation({ summary: 'Enregistrer les valeurs des champs dynamiques du formulaire' })
  @ApiOkResponse({ type: InterventionEntity })
  upsertValeursChamp(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpsertValeursChampDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<InterventionEntity> {
    return this.interventionsService.upsertValeursChamp(id, dto, user);
  }
}
