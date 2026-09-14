import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertClientAccess } from '../common/authorization/assert-client-access';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateClientDto) {
    return this.prisma.client.create({ data: dto });
  }

  findAll() {
    return this.prisma.client.findMany({ orderBy: { nom: 'asc' } });
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client ${id} introuvable`);
    }
    assertClientAccess(user, client.id);
    return client;
  }

  async update(id: number, dto: UpdateClientDto) {
    await this.ensureExists(id);
    return this.prisma.client.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    await this.prisma.client.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: number) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client ${id} introuvable`);
    }
    return client;
  }
}
