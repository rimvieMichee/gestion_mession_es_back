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
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { SiteEntity } from './entities/site.entity';
import { SitesService } from './sites.service';

@ApiTags('Sites')
@ApiBearerAuth('JWT-auth')
@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: "Créer un site physique rattaché à un client" })
  @ApiCreatedResponse({ type: SiteEntity })
  create(@Body() dto: CreateSiteDto): Promise<SiteEntity> {
    return this.sitesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les sites (filtrable par client)' })
  @ApiOkResponse({ type: [SiteEntity] })
  findAll(
    @Query() query: FilterByClientDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<SiteEntity[]> {
    return this.sitesService.findAll(user, query.clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulter un site' })
  @ApiOkResponse({ type: SiteEntity })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<SiteEntity> {
    return this.sitesService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: 'Mettre à jour un site' })
  @ApiOkResponse({ type: SiteEntity })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSiteDto): Promise<SiteEntity> {
    return this.sitesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: 'Supprimer un site' })
  @ApiOkResponse({ type: SuccessResponseEntity })
  remove(@Param('id', ParseIntPipe) id: number): Promise<SuccessResponseEntity> {
    return this.sitesService.remove(id);
  }
}
