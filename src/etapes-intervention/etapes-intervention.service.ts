import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatutEtape } from '../../generated/prisma/enums';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import {
  assertCanActOnIntervention,
  assertCanViewIntervention,
} from '../interventions/interventions.authorization';
import { UpdateEtapeDto } from './dto/update-etape.dto';

@Injectable()
export class EtapesInterventionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(interventionId: number, user: AuthenticatedUser) {
    const intervention = await this.getInterventionOrThrow(interventionId);
    assertCanViewIntervention(user, intervention);
    return this.prisma.etapeIntervention.findMany({
      where: { interventionId },
      include: { piecesJointes: true },
      orderBy: { ordre: 'asc' },
    });
  }

  async update(
    interventionId: number,
    etapeId: number,
    dto: UpdateEtapeDto,
    user: AuthenticatedUser,
  ) {
    const intervention = await this.getInterventionOrThrow(interventionId);
    assertCanActOnIntervention(user, intervention);

    const etape = await this.prisma.etapeIntervention.findUnique({ where: { id: etapeId } });
    if (!etape || etape.interventionId !== interventionId) {
      throw new NotFoundException(`Étape ${etapeId} introuvable pour cette intervention`);
    }

    return this.prisma.etapeIntervention.update({
      where: { id: etapeId },
      data: {
        ...dto,
        dateRealisation:
          dto.statut === StatutEtape.TERMINEE && !etape.dateRealisation
            ? new Date()
            : undefined,
      },
      include: { piecesJointes: true },
    });
  }

  private async getInterventionOrThrow(interventionId: number) {
    const intervention = await this.prisma.intervention.findUnique({
      where: { id: interventionId },
      include: { techniciens: true },
    });
    if (!intervention) {
      throw new NotFoundException(`Intervention ${interventionId} introuvable`);
    }
    return intervention;
  }
}
