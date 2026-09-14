import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChampPersonnaliseDto } from './dto/create-champ-personnalise.dto';
import { UpdateChampPersonnaliseDto } from './dto/update-champ-personnalise.dto';

@Injectable()
export class ChampsPersonnalisesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateChampPersonnaliseDto) {
    return this.prisma.champPersonnalise.create({ data: dto });
  }

  findAll(typeFicheId?: number) {
    return this.prisma.champPersonnalise.findMany({
      where: typeFicheId !== undefined ? { typeFicheId } : undefined,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const champ = await this.prisma.champPersonnalise.findUnique({ where: { id } });
    if (!champ) {
      throw new NotFoundException(`Champ personnalisé ${id} introuvable`);
    }
    return champ;
  }

  async update(id: number, dto: UpdateChampPersonnaliseDto) {
    await this.ensureExists(id);
    return this.prisma.champPersonnalise.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    await this.prisma.champPersonnalise.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: number) {
    const champ = await this.prisma.champPersonnalise.findUnique({ where: { id } });
    if (!champ) {
      throw new NotFoundException(`Champ personnalisé ${id} introuvable`);
    }
    return champ;
  }
}
