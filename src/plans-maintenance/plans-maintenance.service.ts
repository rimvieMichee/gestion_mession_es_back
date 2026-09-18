import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanMaintenanceDto } from './dto/create-plan-maintenance.dto';
import { UpdatePlanMaintenanceDto } from './dto/update-plan-maintenance.dto';

@Injectable()
export class PlansMaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePlanMaintenanceDto) {
    await this.assertSiteBelongsToClient(dto.siteId, dto.clientId);
    return this.prisma.planMaintenance.create({
      data: {
        ...dto,
        prochaineExecution: new Date(dto.prochaineExecution),
        derniereExecution: dto.derniereExecution ? new Date(dto.derniereExecution) : undefined,
      },
    });
  }

  findAll() {
    return this.prisma.planMaintenance.findMany({ orderBy: { prochaineExecution: 'asc' } });
  }

  /** Plans actifs dont la prochaine exécution tombe dans les [days] prochains jours. */
  async findUpcoming(days = 7) {
    const limite = new Date();
    limite.setDate(limite.getDate() + days);
    return this.prisma.planMaintenance.findMany({
      where: { actif: true, prochaineExecution: { lte: limite } },
      orderBy: { prochaineExecution: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.ensureExists(id);
  }

  async update(id: number, dto: UpdatePlanMaintenanceDto) {
    const existing = await this.ensureExists(id);
    if (dto.siteId !== undefined || dto.clientId !== undefined) {
      await this.assertSiteBelongsToClient(dto.siteId ?? existing.siteId, dto.clientId ?? existing.clientId);
    }
    return this.prisma.planMaintenance.update({
      where: { id },
      data: {
        ...dto,
        prochaineExecution: dto.prochaineExecution ? new Date(dto.prochaineExecution) : undefined,
        derniereExecution: dto.derniereExecution ? new Date(dto.derniereExecution) : undefined,
      },
    });
  }

  async toggleActif(id: number) {
    const plan = await this.ensureExists(id);
    return this.prisma.planMaintenance.update({ where: { id }, data: { actif: !plan.actif } });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    await this.prisma.planMaintenance.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: number) {
    const plan = await this.prisma.planMaintenance.findUnique({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`Plan de maintenance ${id} introuvable`);
    }
    return plan;
  }

  private async assertSiteBelongsToClient(siteId: number, clientId: number): Promise<void> {
    const site = await this.prisma.site.findUnique({ where: { id: siteId } });
    if (!site || site.clientId !== clientId) {
      throw new BadRequestException("Le site indiqué n'appartient pas à ce client");
    }
  }
}
