import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import {
  assertCanActOnIntervention,
  assertCanViewIntervention,
} from '../interventions/interventions.authorization';
import { CreatePieceJointeDto } from './dto/create-piece-jointe.dto';

@Injectable()
export class PiecesJointesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(interventionId: number, dto: CreatePieceJointeDto, user: AuthenticatedUser) {
    const intervention = await this.getInterventionOrThrow(interventionId);
    assertCanActOnIntervention(user, intervention);
    return this.prisma.pieceJointe.create({
      data: { ...dto, interventionId },
    });
  }

  async findAll(interventionId: number, user: AuthenticatedUser) {
    const intervention = await this.getInterventionOrThrow(interventionId);
    assertCanViewIntervention(user, intervention);
    return this.prisma.pieceJointe.findMany({
      where: { interventionId },
      orderBy: { dateAjout: 'desc' },
    });
  }

  async remove(interventionId: number, id: number, user: AuthenticatedUser) {
    const intervention = await this.getInterventionOrThrow(interventionId);
    assertCanActOnIntervention(user, intervention);
    const piece = await this.prisma.pieceJointe.findUnique({ where: { id } });
    if (!piece || piece.interventionId !== interventionId) {
      throw new NotFoundException(`Pièce jointe ${id} introuvable pour cette intervention`);
    }
    await this.prisma.pieceJointe.delete({ where: { id } });
    return { success: true };
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
