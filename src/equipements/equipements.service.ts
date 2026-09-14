import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertClientAccess, resolveClientScope } from '../common/authorization/assert-client-access';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { CreateEquipementDto } from './dto/create-equipement.dto';
import { UpdateEquipementDto } from './dto/update-equipement.dto';

@Injectable()
export class EquipementsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEquipementDto) {
    await this.assertSiteBelongsToClient(dto.clientId, dto.siteId);
    return this.prisma.equipement.create({ data: dto });
  }

  findAll(user: AuthenticatedUser, requestedClientId?: number) {
    const clientId = resolveClientScope(user, requestedClientId);
    return this.prisma.equipement.findMany({
      where: clientId !== undefined ? { clientId } : undefined,
      orderBy: { nom: 'asc' },
    });
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const equipement = await this.prisma.equipement.findUnique({ where: { id } });
    if (!equipement) {
      throw new NotFoundException(`Équipement ${id} introuvable`);
    }
    assertClientAccess(user, equipement.clientId);
    return equipement;
  }

  async update(id: number, dto: UpdateEquipementDto) {
    const existing = await this.ensureExists(id);
    const clientId = dto.clientId ?? existing.clientId;
    if (dto.siteId !== undefined) {
      await this.assertSiteBelongsToClient(clientId, dto.siteId);
    }
    return this.prisma.equipement.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    await this.prisma.equipement.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: number) {
    const equipement = await this.prisma.equipement.findUnique({ where: { id } });
    if (!equipement) {
      throw new NotFoundException(`Équipement ${id} introuvable`);
    }
    return equipement;
  }

  private async assertSiteBelongsToClient(clientId: number, siteId?: number | null) {
    if (!siteId) return;
    const site = await this.prisma.site.findUnique({ where: { id: siteId } });
    if (!site || site.clientId !== clientId) {
      throw new BadRequestException('Le site indiqué n\'appartient pas à ce client');
    }
  }
}
