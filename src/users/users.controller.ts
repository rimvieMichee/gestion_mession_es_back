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
import { ROLES, STAFF_MANAGER_ROLES } from '../common/constants/roles.constant';
import { Roles } from '../auth/decorators/roles.decorator';
import { SuccessResponseEntity } from '../common/entities/success-response.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Utilisateurs')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(ROLES.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Créer un compte utilisateur (réservé à un administrateur)' })
  @ApiCreatedResponse({ type: UserEntity })
  create(@Body() dto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(dto);
  }

  @Get()
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: 'Lister tous les utilisateurs (personnel interne, pour affectation de missions/responsables)' })
  @ApiOkResponse({ type: [UserEntity] })
  findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: 'Consulter un utilisateur par son identifiant' })
  @ApiOkResponse({ type: UserEntity })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(ROLES.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Mettre à jour un utilisateur (réservé à un administrateur)' })
  @ApiOkResponse({ type: UserEntity })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto): Promise<UserEntity> {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(ROLES.ADMINISTRATEUR)
  @ApiOperation({ summary: 'Supprimer un utilisateur (réservé à un administrateur)' })
  @ApiOkResponse({ type: SuccessResponseEntity })
  remove(@Param('id', ParseIntPipe) id: number): Promise<SuccessResponseEntity> {
    return this.usersService.remove(id);
  }
}
