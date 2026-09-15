import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { decimalToNumber } from '../common/utils/decimal';
import { TypeMouvementStock } from '../../generated/prisma/enums';
import { CreateMaterielDto } from './dto/create-materiel.dto';
import { UpdateMaterielDto } from './dto/update-materiel.dto';
import { CreateMouvementStockDto } from './dto/create-mouvement-stock.dto';

@Injectable()
export class MaterielsService {
  constructor(private readonly prisma: PrismaService) {}

  private serialize<T extends { prixUnitaire: unknown }>(materiel: T) {
    return { ...materiel, prixUnitaire: decimalToNumber(materiel.prixUnitaire as any) ?? 0 };
  }

  async create(dto: CreateMaterielDto) {
    const materiel = await this.prisma.materiel.create({ data: dto });
    return this.serialize(materiel);
  }

  async findAll() {
    const materiels = await this.prisma.materiel.findMany({ orderBy: { nom: 'asc' } });
    return materiels.map((m) => this.serialize(m));
  }

  /** Matériels dont le stock est au niveau ou en dessous du seuil minimal. */
  async findCritical() {
    const materiels = await this.prisma.materiel.findMany({ orderBy: { nom: 'asc' } });
    return materiels
      .filter((m) => m.stockActuel <= m.seuilMin)
      .map((m) => this.serialize(m));
  }

  async findOne(id: number) {
    const materiel = await this.ensureExists(id);
    return this.serialize(materiel);
  }

  async update(id: number, dto: UpdateMaterielDto) {
    await this.ensureExists(id);
    const materiel = await this.prisma.materiel.update({ where: { id }, data: dto });
    return this.serialize(materiel);
  }

  async remove(id: number) {
    await this.ensureExists(id);
    await this.prisma.materiel.delete({ where: { id } });
    return { success: true };
  }

  async findMouvements(materielId: number) {
    await this.ensureExists(materielId);
    return this.prisma.mouvementStock.findMany({
      where: { materielId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Enregistre un mouvement de stock et met à jour `stockActuel` en
   * conséquence (ENTREE/AJUSTEMENT ajoutent, SORTIE retire — refusé si le
   * stock ne suffit pas).
   */
  async createMouvement(materielId: number, dto: CreateMouvementStockDto) {
    const materiel = await this.ensureExists(materielId);

    const delta = dto.type === TypeMouvementStock.SORTIE ? -dto.quantite : dto.quantite;
    const nouveauStock = materiel.stockActuel + delta;
    if (nouveauStock < 0) {
      throw new BadRequestException(
        `Stock insuffisant : ${materiel.stockActuel} disponible(s), ${dto.quantite} demandé(s)`,
      );
    }

    const [mouvement] = await this.prisma.$transaction([
      this.prisma.mouvementStock.create({
        data: {
          materielId,
          type: dto.type,
          quantite: dto.quantite,
          motif: dto.motif,
          interventionId: dto.interventionId,
        },
      }),
      this.prisma.materiel.update({
        where: { id: materielId },
        data: { stockActuel: nouveauStock },
      }),
    ]);

    return mouvement;
  }

  private async ensureExists(id: number) {
    const materiel = await this.prisma.materiel.findUnique({ where: { id } });
    if (!materiel) {
      throw new NotFoundException(`Matériel ${id} introuvable`);
    }
    return materiel;
  }
}
