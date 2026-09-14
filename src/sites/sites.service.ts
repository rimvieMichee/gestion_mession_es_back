import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertClientAccess, resolveClientScope } from '../common/authorization/assert-client-access';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SitesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateSiteDto) {
    return this.prisma.site.create({ data: dto });
  }

  findAll(user: AuthenticatedUser, requestedClientId?: number) {
    const clientId = resolveClientScope(user, requestedClientId);
    return this.prisma.site.findMany({
      where: clientId !== undefined ? { clientId } : undefined,
      orderBy: { nom: 'asc' },
    });
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const site = await this.prisma.site.findUnique({ where: { id } });
    if (!site) {
      throw new NotFoundException(`Site ${id} introuvable`);
    }
    assertClientAccess(user, site.clientId);
    return site;
  }

  async update(id: number, dto: UpdateSiteDto) {
    await this.ensureExists(id);
    return this.prisma.site.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    await this.prisma.site.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: number) {
    const site = await this.prisma.site.findUnique({ where: { id } });
    if (!site) {
      throw new NotFoundException(`Site ${id} introuvable`);
    }
    return site;
  }
}
