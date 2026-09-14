import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly publicSelect = {
    id: true,
    nom: true,
    prenom: true,
    email: true,
    roleId: true,
    clientId: true,
    role: { select: { id: true, libelle: true } },
    client: { select: { id: true, nom: true } },
    createdAt: true,
    updatedAt: true,
  };

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.utilisateur.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    const motDePasse = await bcrypt.hash(dto.motDePasse, SALT_ROUNDS);

    return this.prisma.utilisateur.create({
      data: {
        nom: dto.nom,
        prenom: dto.prenom,
        email: dto.email,
        motDePasse,
        roleId: dto.roleId,
        clientId: dto.clientId ?? null,
      },
      select: this.publicSelect,
    });
  }

  findAll() {
    return this.prisma.utilisateur.findMany({ select: this.publicSelect });
  }

  async findOne(id: number) {
    const user = await this.prisma.utilisateur.findUnique({
      where: { id },
      select: this.publicSelect,
    });
    if (!user) {
      throw new NotFoundException(`Utilisateur ${id} introuvable`);
    }
    return user;
  }

  /** Utilisé par l'auth : inclut le mot de passe hashé pour vérification. */
  findByEmailWithCredentials(email: string) {
    return this.prisma.utilisateur.findUnique({
      where: { email },
      include: { role: true, client: true },
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);
    return this.prisma.utilisateur.update({
      where: { id },
      data: dto,
      select: this.publicSelect,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.utilisateur.delete({ where: { id } });
    return { success: true };
  }
}
