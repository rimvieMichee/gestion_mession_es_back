import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { decimalToNumber } from '../common/utils/decimal';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import {
  assertCanActOnIntervention,
  assertCanViewIntervention,
} from '../interventions/interventions.authorization';
import { TypeMouvementStock } from '../../generated/prisma/enums';
import { MaterielsService } from '../materiels/materiels.service';
import { CreateInterventionMaterielDto } from './dto/create-intervention-materiel.dto';

@Injectable()
export class InterventionMaterielsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly materielsService: MaterielsService,
  ) {}

  /**
   * Matériel déjà utilisé/prélevé pour cette intervention — le technicien
   * comme le personnel de pilotage peuvent la consulter (mêmes règles que
   * pour consulter l'intervention elle-même).
   */
  async findAll(interventionId: number, user: AuthenticatedUser) {
    const intervention = await this.getInterventionOrThrow(interventionId);
    assertCanViewIntervention(user, intervention);

    const mouvements = await this.prisma.mouvementStock.findMany({
      where: { interventionId, type: TypeMouvementStock.SORTIE },
      include: { materiel: true },
      orderBy: { createdAt: 'desc' },
    });

    return mouvements.map((m) => ({
      ...m,
      interventionId: m.interventionId!,
      materiel: { ...m.materiel, prixUnitaire: decimalToNumber(m.materiel.prixUnitaire) ?? 0 },
    }));
  }

  /**
   * Ajoute du matériel à l'intervention (prélevé du stock) — utilisé aussi
   * bien par un manager qui prépare la mission que par le technicien affecté
   * qui signale/ajoute du matériel manquant sur le terrain.
   */
  async create(interventionId: number, dto: CreateInterventionMaterielDto, user: AuthenticatedUser) {
    const intervention = await this.getInterventionOrThrow(interventionId);
    assertCanActOnIntervention(user, intervention);

    const mouvement = await this.materielsService.createMouvement(dto.materielId, {
      type: TypeMouvementStock.SORTIE,
      quantite: dto.quantite,
      motif: dto.motif,
      interventionId,
    });

    const materiel = await this.materielsService.findOne(dto.materielId);
    return { ...mouvement, interventionId: mouvement.interventionId!, materiel };
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
