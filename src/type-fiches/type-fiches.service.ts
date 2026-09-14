import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTypeFicheDto } from './dto/create-type-fiche.dto';
import { UpdateTypeFicheDto } from './dto/update-type-fiche.dto';

@Injectable()
export class TypeFichesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTypeFicheDto) {
    return this.prisma.typeFiche.create({ data: dto });
  }

  findAll() {
    return this.prisma.typeFiche.findMany({
      include: { champsPersonnalises: true },
      orderBy: { libelle: 'asc' },
    });
  }

  async findOne(id: number) {
    const typeFiche = await this.prisma.typeFiche.findUnique({
      where: { id },
      include: { champsPersonnalises: true },
    });
    if (!typeFiche) {
      throw new NotFoundException(`Type de fiche ${id} introuvable`);
    }
    return typeFiche;
  }

  async update(id: number, dto: UpdateTypeFicheDto) {
    await this.ensureExists(id);
    return this.prisma.typeFiche.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    await this.prisma.typeFiche.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: number) {
    const typeFiche = await this.prisma.typeFiche.findUnique({ where: { id } });
    if (!typeFiche) {
      throw new NotFoundException(`Type de fiche ${id} introuvable`);
    }
    return typeFiche;
  }
}
