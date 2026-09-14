import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertClientAccess, resolveClientScope } from '../common/authorization/assert-client-access';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { CreateContratDto } from './dto/create-contrat.dto';
import { UpdateContratDto } from './dto/update-contrat.dto';

@Injectable()
export class ContratsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateContratDto) {
    return this.prisma.contrat.create({
      data: {
        ...dto,
        dateDebut: new Date(dto.dateDebut),
        dateFin: new Date(dto.dateFin),
      },
    });
  }

  findAll(user: AuthenticatedUser, requestedClientId?: number) {
    const clientId = resolveClientScope(user, requestedClientId);
    return this.prisma.contrat.findMany({
      where: clientId !== undefined ? { clientId } : undefined,
      orderBy: { dateDebut: 'desc' },
    });
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const contrat = await this.prisma.contrat.findUnique({ where: { id } });
    if (!contrat) {
      throw new NotFoundException(`Contrat ${id} introuvable`);
    }
    assertClientAccess(user, contrat.clientId);
    return contrat;
  }

  async update(id: number, dto: UpdateContratDto) {
    await this.ensureExists(id);
    return this.prisma.contrat.update({
      where: { id },
      data: {
        ...dto,
        dateDebut: dto.dateDebut ? new Date(dto.dateDebut) : undefined,
        dateFin: dto.dateFin ? new Date(dto.dateFin) : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    await this.prisma.contrat.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: number) {
    const contrat = await this.prisma.contrat.findUnique({ where: { id } });
    if (!contrat) {
      throw new NotFoundException(`Contrat ${id} introuvable`);
    }
    return contrat;
  }
}
