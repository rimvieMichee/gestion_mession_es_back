import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertClientAccess, resolveClientScope } from '../common/authorization/assert-client-access';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateContactDto) {
    return this.prisma.contact.create({ data: dto });
  }

  findAll(user: AuthenticatedUser, requestedClientId?: number) {
    const clientId = resolveClientScope(user, requestedClientId);
    return this.prisma.contact.findMany({
      where: clientId !== undefined ? { clientId } : undefined,
      orderBy: { nom: 'asc' },
    });
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact ${id} introuvable`);
    }
    assertClientAccess(user, contact.clientId);
    return contact;
  }

  async update(id: number, dto: UpdateContactDto) {
    await this.ensureExists(id);
    return this.prisma.contact.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    await this.prisma.contact.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: number) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact ${id} introuvable`);
    }
    return contact;
  }
}
