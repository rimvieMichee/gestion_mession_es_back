import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import {
  assertCanActOnIntervention,
  assertCanViewIntervention,
} from '../interventions/interventions.authorization';
import { CreateFicheConnaissanceDto } from './dto/create-fiche-connaissance.dto';
import { SearchFicheConnaissanceDto } from './dto/search-fiche-connaissance.dto';
import { UpdateFicheConnaissanceDto } from './dto/update-fiche-connaissance.dto';

@Injectable()
export class FichesConnaissanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(interventionId: number, dto: CreateFicheConnaissanceDto, user: AuthenticatedUser) {
    const intervention = await this.getInterventionOrThrow(interventionId);
    assertCanActOnIntervention(user, intervention);

    const existing = await this.prisma.ficheConnaissance.findUnique({ where: { interventionId } });
    if (existing) {
      throw new ConflictException(
        'Une fiche de connaissance existe déjà pour cette intervention (une seule autorisée)',
      );
    }

    return this.prisma.ficheConnaissance.create({ data: { ...dto, interventionId } });
  }

  async findForIntervention(interventionId: number, user: AuthenticatedUser) {
    const intervention = await this.getInterventionOrThrow(interventionId);
    assertCanViewIntervention(user, intervention);
    const fiche = await this.prisma.ficheConnaissance.findUnique({ where: { interventionId } });
    if (!fiche) {
      throw new NotFoundException("Aucune fiche de connaissance pour cette intervention");
    }
    return fiche;
  }

  async update(interventionId: number, dto: UpdateFicheConnaissanceDto, user: AuthenticatedUser) {
    const intervention = await this.getInterventionOrThrow(interventionId);
    assertCanActOnIntervention(user, intervention);
    await this.findForIntervention(interventionId, user);
    return this.prisma.ficheConnaissance.update({ where: { interventionId }, data: dto });
  }

  /** Base de connaissances : recherche libre, ouverte à tout utilisateur authentifié. */
  search(query: SearchFicheConnaissanceDto) {
    return this.prisma.ficheConnaissance.findMany({
      where: query.search
        ? {
            OR: [
              { probleme: { contains: query.search, mode: 'insensitive' } },
              { diagnostic: { contains: query.search, mode: 'insensitive' } },
              { solution: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const fiche = await this.prisma.ficheConnaissance.findUnique({ where: { id } });
    if (!fiche) {
      throw new NotFoundException(`Fiche de connaissance ${id} introuvable`);
    }
    return fiche;
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
