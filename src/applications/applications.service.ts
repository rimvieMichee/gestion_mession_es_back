import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertClientAccess, resolveClientScope } from '../common/authorization/assert-client-access';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateApplicationDto) {
    return this.prisma.application.create({ data: dto });
  }

  findAll(user: AuthenticatedUser, requestedClientId?: number) {
    const clientId = resolveClientScope(user, requestedClientId);
    return this.prisma.application.findMany({
      where: clientId !== undefined ? { clientId } : undefined,
      orderBy: { nom: 'asc' },
    });
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const application = await this.prisma.application.findUnique({ where: { id } });
    if (!application) {
      throw new NotFoundException(`Application ${id} introuvable`);
    }
    assertClientAccess(user, application.clientId);
    return application;
  }

  async update(id: number, dto: UpdateApplicationDto) {
    await this.ensureExists(id);
    return this.prisma.application.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    await this.prisma.application.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: number) {
    const application = await this.prisma.application.findUnique({ where: { id } });
    if (!application) {
      throw new NotFoundException(`Application ${id} introuvable`);
    }
    return application;
  }
}
