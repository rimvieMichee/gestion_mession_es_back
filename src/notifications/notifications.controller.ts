import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { STAFF_MANAGER_ROLES } from '../common/constants/roles.constant';
import { SuccessResponseEntity } from '../common/entities/success-response.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @Roles(...STAFF_MANAGER_ROLES)
  @ApiOperation({ summary: 'Envoyer une notification à un utilisateur' })
  @ApiCreatedResponse({ type: NotificationEntity })
  create(@Body() dto: CreateNotificationDto): Promise<NotificationEntity> {
    return this.notificationsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister mes notifications' })
  @ApiOkResponse({ type: [NotificationEntity] })
  findMine(@CurrentUser() user: AuthenticatedUser): Promise<NotificationEntity[]> {
    return this.notificationsService.findMine(user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Marquer une notification comme lue (ou non lue)' })
  @ApiOkResponse({ type: NotificationEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNotificationDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<NotificationEntity> {
    return this.notificationsService.update(id, dto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une notification' })
  @ApiOkResponse({ type: SuccessResponseEntity })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<SuccessResponseEntity> {
    return this.notificationsService.remove(id, user);
  }
}
