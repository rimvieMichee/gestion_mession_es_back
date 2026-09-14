import { Injectable, NotFoundException } from '@nestjs/common';
import type { Projet } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { assertClientAccess, resolveClientScope } from '../common/authorization/assert-client-access';
import { decimalToNumber } from '../common/utils/decimal';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { CreateProjetDto } from './dto/create-projet.dto';
import { UpdateProjetDto } from './dto/update-projet.dto';
import { ProjetEntity } from './entities/projet.entity';

@Injectable()
export class ProjetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProjetDto): Promise<ProjetEntity> {
    const projet = await this.prisma.projet.create({
      data: {
        ...dto,
        dateDebut: new Date(dto.dateDebut),
        dateFin: dto.dateFin ? new Date(dto.dateFin) : undefined,
      },
    });
    return this.serialize(projet);
  }

  async findAll(user: AuthenticatedUser, requestedClientId?: number): Promise<ProjetEntity[]> {
    const clientId = resolveClientScope(user, requestedClientId);
    const projets = await this.prisma.projet.findMany({
      where: clientId !== undefined ? { clientId } : undefined,
      orderBy: { dateDebut: 'desc' },
    });
    return projets.map((p) => this.serialize(p));
  }

  async findOne(id: number, user: AuthenticatedUser): Promise<ProjetEntity> {
    const projet = await this.prisma.projet.findUnique({ where: { id } });
    if (!projet) {
      throw new NotFoundException(`Projet ${id} introuvable`);
    }
    assertClientAccess(user, projet.clientId);
    return this.serialize(projet);
  }

  async update(id: number, dto: UpdateProjetDto): Promise<ProjetEntity> {
    await this.ensureExists(id);
    const projet = await this.prisma.projet.update({
      where: { id },
      data: {
        ...dto,
        dateDebut: dto.dateDebut ? new Date(dto.dateDebut) : undefined,
        dateFin: dto.dateFin ? new Date(dto.dateFin) : undefined,
      },
    });
    return this.serialize(projet);
  }

  async remove(id: number) {
    await this.ensureExists(id);
    await this.prisma.projet.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: number) {
    const projet = await this.prisma.projet.findUnique({ where: { id } });
    if (!projet) {
      throw new NotFoundException(`Projet ${id} introuvable`);
    }
    return projet;
  }

  private serialize(projet: Projet): ProjetEntity {
    return { ...projet, tauxAvancement: decimalToNumber(projet.tauxAvancement) ?? 0 };
  }
}
