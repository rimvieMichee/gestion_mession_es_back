import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { ROLES, STAFF_MANAGER_ROLES } from '../common/constants/roles.constant';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({ data: dto });
  }

  /** Chaque utilisateur ne voit que ses propres notifications. */
  findMine(user: AuthenticatedUser) {
    return this.prisma.notification.findMany({
      where: { utilisateurId: user.sub },
      orderBy: { dateCreation: 'desc' },
    });
  }

  async update(id: number, dto: UpdateNotificationDto, user: AuthenticatedUser) {
    const notification = await this.getOrThrow(id);
    this.assertOwnerOrStaff(notification.utilisateurId, user);
    return this.prisma.notification.update({ where: { id }, data: dto });
  }

  async remove(id: number, user: AuthenticatedUser) {
    const notification = await this.getOrThrow(id);
    this.assertOwnerOrStaff(notification.utilisateurId, user);
    await this.prisma.notification.delete({ where: { id } });
    return { success: true };
  }

  private async getOrThrow(id: number) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) {
      throw new NotFoundException(`Notification ${id} introuvable`);
    }
    return notification;
  }

  private assertOwnerOrStaff(ownerId: number, user: AuthenticatedUser) {
    const staffRoles: string[] = [...STAFF_MANAGER_ROLES, ROLES.DIRECTION];
    if (ownerId !== user.sub && !staffRoles.includes(user.role)) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à modifier cette notification");
    }
  }
}
