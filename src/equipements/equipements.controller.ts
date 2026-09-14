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
import { CreateEquipementDto } from './dto/create-equipement.dto';
import { UpdateEquipementDto } from './dto/update-equipement.dto';
import { EquipementEntity } from './entities/equipement.entity';
import { EquipementsService } from './equipements.service';

@ApiTags('Équipements')
@ApiBearerAuth('JWT-auth')
@Controller('equipements')
export class EquipementsController {
  constructor(private readonly equipementsService: EquipementsService) {}

  @Post()
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: 'Créer un équipement informatique appartenant à un client' })
  @ApiCreatedResponse({ type: EquipementEntity })
  create(@Body() dto: CreateEquipementDto): Promise<EquipementEntity> {
    return this.equipementsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les équipements (filtrable par client)' })
  @ApiOkResponse({ type: [EquipementEntity] })
  findAll(
    @Query() query: FilterByClientDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<EquipementEntity[]> {
    return this.equipementsService.findAll(user, query.clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulter un équipement' })
  @ApiOkResponse({ type: EquipementEntity })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<EquipementEntity> {
    return this.equipementsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: 'Mettre à jour un équipement' })
  @ApiOkResponse({ type: EquipementEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEquipementDto,
  ): Promise<EquipementEntity> {
    return this.equipementsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: 'Supprimer un équipement' })
  @ApiOkResponse({ type: SuccessResponseEntity })
  remove(@Param('id', ParseIntPipe) id: number): Promise<SuccessResponseEntity> {
    return this.equipementsService.remove(id);
  }
}
