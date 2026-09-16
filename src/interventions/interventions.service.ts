import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { decimalToNumber } from '../common/utils/decimal';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { StatutIntervention } from '../../generated/prisma/enums';
import { STATUT_TRANSITIONS } from './constants/statut-transitions.constant';
import {
  assertCanActOnIntervention,
  assertCanViewIntervention,
  buildInterventionsWhere,
} from './interventions.authorization';
import { AssignTechnicienDto } from './dto/assign-technicien.dto';
import { ChangeStatutDto } from './dto/change-statut.dto';
import { CreateInterventionDto } from './dto/create-intervention.dto';
import { FilterInterventionsDto } from './dto/filter-interventions.dto';
import { UpdateCompteRenduDto } from './dto/update-compte-rendu.dto';
import { UpdateInterventionDto } from './dto/update-intervention.dto';
import { UpsertValeursChampDto } from './dto/upsert-valeurs-champ.dto';

const FULL_INCLUDE = {
  client: true,
  site: true,
  contrat: true,
  projet: true,
  typeFiche: { include: { champsPersonnalises: true } },
  responsable: { select: { id: true, nom: true, prenom: true, email: true } },
  techniciens: {
    include: { technicien: { select: { id: true, nom: true, prenom: true, email: true } } },
  },
  valeursChamp: { include: { champ: true } },
  piecesJointes: true,
  signatures: true,
  historiqueStatuts: {
    orderBy: { dateChangement: 'desc' as const },
    include: { utilisateur: { select: { id: true, nom: true, prenom: true } } },
  },
};

@Injectable()
export class InterventionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInterventionDto, user: AuthenticatedUser) {
    const site = await this.prisma.site.findUnique({ where: { id: dto.siteId } });
    if (!site || site.clientId !== dto.clientId) {
      throw new BadRequestException("Le site indiqué n'appartient pas à ce client");
    }
    if (dto.contratId) {
      await this.assertBelongsToClient('contrat', dto.contratId, dto.clientId);
    }
    if (dto.projetId) {
      await this.assertBelongsToClient('projet', dto.projetId, dto.clientId);
    }

    const numero = await this.generateNumero();

    const intervention = await this.prisma.intervention.create({
      data: {
        numero,
        date: new Date(dto.date),
        mode: dto.mode,
        objet: dto.objet,
        descriptionDemande: dto.descriptionDemande,
        clientId: dto.clientId,
        siteId: dto.siteId,
        contratId: dto.contratId,
        projetId: dto.projetId,
        typeFicheId: dto.typeFicheId,
        responsableId: dto.responsableId,
        statut: StatutIntervention.NOUVELLE,
        natureIntervention: dto.natureIntervention,
        typeEquipement: dto.typeEquipement,
        niveauRisque: dto.niveauRisque,
        typeDefaillance: dto.typeDefaillance,
        causeRacine: dto.causeRacine,
        datePlanifiee: dto.datePlanifiee ? new Date(dto.datePlanifiee) : undefined,
        techniciens: dto.technicienIds
          ? { create: dto.technicienIds.map((technicienId) => ({ technicienId })) }
          : undefined,
      },
      include: FULL_INCLUDE,
    });

    await this.prisma.historiqueStatut.create({
      data: {
        interventionId: intervention.id,
        statut: StatutIntervention.NOUVELLE,
        utilisateurId: user.sub,
      },
    });

    return this.serialize(intervention);
  }

  async findAll(user: AuthenticatedUser, filter: FilterInterventionsDto) {
    const where = buildInterventionsWhere(user, filter);
    const interventions = await this.prisma.intervention.findMany({
      where,
      include: FULL_INCLUDE,
      orderBy: { date: 'desc' },
    });
    return interventions.map((i) => this.serialize(i));
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const intervention = await this.getOrThrow(id);
    assertCanViewIntervention(user, intervention);
    return intervention;
  }

  async update(id: number, dto: UpdateInterventionDto) {
    await this.getOrThrow(id);
    const intervention = await this.prisma.intervention.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
        datePlanifiee: dto.datePlanifiee ? new Date(dto.datePlanifiee) : undefined,
      },
      include: FULL_INCLUDE,
    });
    return this.serialize(intervention);
  }

  async remove(id: number) {
    await this.getOrThrow(id);
    await this.prisma.intervention.delete({ where: { id } });
    return { success: true };
  }

  async updateCompteRendu(id: number, dto: UpdateCompteRenduDto, user: AuthenticatedUser) {
    const intervention = await this.getOrThrow(id);
    assertCanActOnIntervention(user, intervention);
    const updated = await this.prisma.intervention.update({
      where: { id },
      data: dto,
      include: FULL_INCLUDE,
    });
    return this.serialize(updated);
  }

  async changeStatut(id: number, dto: ChangeStatutDto, user: AuthenticatedUser) {
    const intervention = await this.getOrThrow(id);
    assertCanActOnIntervention(user, intervention);

    const allowed = STATUT_TRANSITIONS[intervention.statut];
    if (!allowed.includes(dto.statut)) {
      throw new BadRequestException(
        `Transition invalide : ${intervention.statut} → ${dto.statut}. Transitions autorisées depuis ${intervention.statut} : ${allowed.join(', ') || 'aucune (statut final)'}`,
      );
    }

    const now = new Date();
    const data: Record<string, unknown> = { statut: dto.statut };

    if (dto.statut === StatutIntervention.EN_COURS && !intervention.heureDebut) {
      data.heureDebut = now;
    }
    if (dto.statut === StatutIntervention.TERMINEE) {
      data.heureFin = now;
      if (intervention.heureDebut) {
        const dureeHeures =
          (now.getTime() - new Date(intervention.heureDebut).getTime()) / (1000 * 60 * 60);
        data.duree = Math.round(dureeHeures * 100) / 100;
      }
    }

    const updated = await this.prisma.intervention.update({
      where: { id },
      data,
      include: FULL_INCLUDE,
    });

    await this.prisma.historiqueStatut.create({
      data: { interventionId: id, statut: dto.statut, utilisateurId: user.sub },
    });

    return this.serialize(updated);
  }

  async assignTechnicien(id: number, dto: AssignTechnicienDto) {
    await this.getOrThrow(id);
    const technicien = await this.prisma.utilisateur.findUnique({ where: { id: dto.technicienId } });
    if (!technicien) {
      throw new NotFoundException(`Utilisateur ${dto.technicienId} introuvable`);
    }
    await this.prisma.interventionTechnicien.upsert({
      where: { interventionId_technicienId: { interventionId: id, technicienId: dto.technicienId } },
      update: { roleSurIntervention: dto.roleSurIntervention },
      create: {
        interventionId: id,
        technicienId: dto.technicienId,
        roleSurIntervention: dto.roleSurIntervention,
      },
    });
    return this.getOrThrow(id);
  }

  async unassignTechnicien(id: number, technicienId: number) {
    await this.getOrThrow(id);
    await this.prisma.interventionTechnicien.deleteMany({
      where: { interventionId: id, technicienId },
    });
    return this.getOrThrow(id);
  }

  async upsertValeursChamp(id: number, dto: UpsertValeursChampDto, user: AuthenticatedUser) {
    const intervention = await this.getOrThrow(id);
    assertCanActOnIntervention(user, intervention);

    await this.prisma.$transaction(
      dto.valeurs.map((item) =>
        this.prisma.valeurChamp.upsert({
          where: { interventionId_champId: { interventionId: id, champId: item.champId } },
          update: { valeur: item.valeur },
          create: { interventionId: id, champId: item.champId, valeur: item.valeur },
        }),
      ),
    );

    return this.getOrThrow(id);
  }

  private async getOrThrow(id: number) {
    const intervention = await this.prisma.intervention.findUnique({
      where: { id },
      include: FULL_INCLUDE,
    });
    if (!intervention) {
      throw new NotFoundException(`Intervention ${id} introuvable`);
    }
    return this.serialize(intervention);
  }

  private serialize<
    T extends {
      duree: import('../../generated/prisma/client').Prisma.Decimal | null;
      projet: { tauxAvancement: import('../../generated/prisma/client').Prisma.Decimal } | null;
    },
  >(intervention: T): Omit<T, 'duree' | 'projet'> & {
    duree: number | null;
    projet: (Omit<NonNullable<T['projet']>, 'tauxAvancement'> & { tauxAvancement: number }) | null;
  } {
    return {
      ...intervention,
      duree: decimalToNumber(intervention.duree),
      projet: intervention.projet
        ? { ...intervention.projet, tauxAvancement: decimalToNumber(intervention.projet.tauxAvancement) ?? 0 }
        : null,
    } as Omit<T, 'duree' | 'projet'> & {
      duree: number | null;
      projet: (Omit<NonNullable<T['projet']>, 'tauxAvancement'> & { tauxAvancement: number }) | null;
    };
  }

  private async generateNumero(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.intervention.count();
    return `INT-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  private async assertBelongsToClient(
    model: 'contrat' | 'projet',
    id: number,
    clientId: number,
  ): Promise<void> {
    const record =
      model === 'contrat'
        ? await this.prisma.contrat.findUnique({ where: { id } })
        : await this.prisma.projet.findUnique({ where: { id } });
    if (!record || record.clientId !== clientId) {
      throw new BadRequestException(
        `Le ${model} indiqué n'appartient pas à ce client`,
      );
    }
  }
}
