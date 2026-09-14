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
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApplicationEntity } from './entities/application.entity';

@ApiTags('Applications')
@ApiBearerAuth('JWT-auth')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: 'Référencer une application logicielle pour un client' })
  @ApiCreatedResponse({ type: ApplicationEntity })
  create(@Body() dto: CreateApplicationDto): Promise<ApplicationEntity> {
    return this.applicationsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les applications (filtrable par client)' })
  @ApiOkResponse({ type: [ApplicationEntity] })
  findAll(
    @Query() query: FilterByClientDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ApplicationEntity[]> {
    return this.applicationsService.findAll(user, query.clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulter une application' })
  @ApiOkResponse({ type: ApplicationEntity })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ApplicationEntity> {
    return this.applicationsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: 'Mettre à jour une application' })
  @ApiOkResponse({ type: ApplicationEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateApplicationDto,
  ): Promise<ApplicationEntity> {
    return this.applicationsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: 'Supprimer une application' })
  @ApiOkResponse({ type: SuccessResponseEntity })
  remove(@Param('id', ParseIntPipe) id: number): Promise<SuccessResponseEntity> {
    return this.applicationsService.remove(id);
  }
}
