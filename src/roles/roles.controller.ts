import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { ROLES } from '../common/constants/roles.constant';
import { RoleEntity } from './entities/role.entity';
import { RolesService } from './roles.service';

@ApiTags('Rôles')
@ApiBearerAuth('JWT-auth')
@Controller('roles')
@Roles(ROLES.ADMINISTRATEUR)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({
    summary: 'Lister les rôles disponibles',
    description:
      "Les 6 rôles (Technicien, Responsable technique, Chef de projet, Direction, Client, Administrateur) sont fixés par la logique d'autorisation de l'application : consultation uniquement, pas de création/suppression via l'API.",
  })
  @ApiOkResponse({ type: [RoleEntity] })
  findAll(): Promise<RoleEntity[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulter un rôle' })
  @ApiOkResponse({ type: RoleEntity })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<RoleEntity> {
    return this.rolesService.findOne(id);
  }
}
