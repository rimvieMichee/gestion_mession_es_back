import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import {
  assertCanActOnIntervention,
  assertCanViewIntervention,
} from '../interventions/interventions.authorization';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';

@Injectable()
export class IncidentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(interventionId: number, dto: CreateIncidentDto, user: AuthenticatedUser) {
    const intervention = await this.getInterventionOrThrow(interventionId);
    assertCanActOnIntervention(user, intervention);
    await this.assertRessourcesBelongToClient(intervention.clientId, dto.equipementId, dto.applicationId);

    return this.prisma.incident.create({
      data: { ...dto, interventionId },
    });
  }

  async findAll(interventionId: number, user: AuthenticatedUser) {
    const intervention = await this.getInterventionOrThrow(interventionId);
    assertCanViewIntervention(user, intervention);
    return this.prisma.incident.findMany({
      where: { interventionId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(interventionId: number, id: number, user: AuthenticatedUser) {
    const intervention = await this.getInterventionOrThrow(interventionId);
    assertCanViewIntervention(user, intervention);
    return this.getIncidentOrThrow(interventionId, id);
  }

  async update(interventionId: number, id: number, dto: UpdateIncidentDto, user: AuthenticatedUser) {
    const intervention = await this.getInterventionOrThrow(interventionId);
    assertCanActOnIntervention(user, intervention);
    await this.getIncidentOrThrow(interventionId, id);
    await this.assertRessourcesBelongToClient(intervention.clientId, dto.equipementId, dto.applicationId);

    return this.prisma.incident.update({ where: { id }, data: dto });
  }

  async remove(interventionId: number, id: number, user: AuthenticatedUser) {
    const intervention = await this.getInterventionOrThrow(interventionId);
    assertCanActOnIntervention(user, intervention);
    await this.getIncidentOrThrow(interventionId, id);
    await this.prisma.incident.delete({ where: { id } });
    return { success: true };
  }

  private async getIncidentOrThrow(interventionId: number, id: number) {
    const incident = await this.prisma.incident.findUnique({ where: { id } });
    if (!incident || incident.interventionId !== interventionId) {
      throw new NotFoundException(`Incident ${id} introuvable pour cette intervention`);
    }
    return incident;
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

  private async assertRessourcesBelongToClient(
    clientId: number,
    equipementId?: number,
    applicationId?: number,
  ) {
    if (equipementId) {
      const equipement = await this.prisma.equipement.findUnique({ where: { id: equipementId } });
      if (!equipement || equipement.clientId !== clientId) {
        throw new BadRequestException("L'équipement indiqué n'appartient pas au client de cette intervention");
      }
    }
    if (applicationId) {
      const application = await this.prisma.application.findUnique({ where: { id: applicationId } });
      if (!application || application.clientId !== clientId) {
        throw new BadRequestException("L'application indiquée n'appartient pas au client de cette intervention");
      }
    }
  }
}
