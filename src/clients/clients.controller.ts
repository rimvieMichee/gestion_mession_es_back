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
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { ROLES, STAFF_MANAGER_ROLES } from '../common/constants/roles.constant';
import { SuccessResponseEntity } from '../common/entities/success-response.entity';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientEntity } from './entities/client.entity';

@ApiTags('Clients')
@ApiBearerAuth('JWT-auth')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: 'Créer un client (organisation cliente de SAHELYS)' })
  @ApiCreatedResponse({ type: ClientEntity })
  create(@Body() dto: CreateClientDto): Promise<ClientEntity> {
    return this.clientsService.create(dto);
  }

  @Get()
  @Roles(...STAFF_MANAGER_ROLES, ROLES.DIRECTION)
  @ApiOperation({ summary: 'Lister tous les clients (réservé au personnel interne)' })
  @ApiOkResponse({ type: [ClientEntity] })
  findAll(): Promise<ClientEntity[]> {
    return this.clientsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Consulter un client',
    description: "Un utilisateur de profil Client ne peut consulter que sa propre organisation.",
  })
  @ApiOkResponse({ type: ClientEntity })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ClientEntity> {
    return this.clientsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: 'Mettre à jour un client' })
  @ApiOkResponse({ type: ClientEntity })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClientDto): Promise<ClientEntity> {
    return this.clientsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: 'Supprimer un client' })
  @ApiOkResponse({ type: SuccessResponseEntity })
  remove(@Param('id', ParseIntPipe) id: number): Promise<SuccessResponseEntity> {
    return this.clientsService.remove(id);
  }
}
