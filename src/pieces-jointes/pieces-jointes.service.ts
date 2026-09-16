import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import {
  assertCanActOnIntervention,
  assertCanViewIntervention,
} from '../interventions/interventions.authorization';
import { CreatePieceJointeDto } from './dto/create-piece-jointe.dto';
import { UploadPieceJointeDto } from './dto/upload-piece-jointe.dto';

@Injectable()
export class PiecesJointesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async create(interventionId: number, dto: CreatePieceJointeDto, user: AuthenticatedUser) {
    const intervention = await this.getInterventionOrThrow(interventionId);
    assertCanActOnIntervention(user, intervention);
    if (dto.etapeId !== undefined) {
      await this.getEtapeOrThrow(interventionId, dto.etapeId);
    }
    return this.prisma.pieceJointe.create({
      data: { ...dto, interventionId },
    });
  }

  /** Téléverse un fichier réel (photo/document) et l'attache à l'intervention. */
  async upload(
    interventionId: number,
    file: Express.Multer.File | undefined,
    dto: UploadPieceJointeDto,
    user: AuthenticatedUser,
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier reçu (champ attendu : "file").');
    }
    const intervention = await this.getInterventionOrThrow(interventionId);
    assertCanActOnIntervention(user, intervention);
    if (dto.etapeId !== undefined) {
      await this.getEtapeOrThrow(interventionId, dto.etapeId);
    }

    const path = `interventions/${interventionId}/${randomUUID()}${extname(file.originalname)}`;
    const chemin = await this.storageService.uploadFile(path, file.buffer, file.mimetype);

    return this.prisma.pieceJointe.create({
      data: {
        typeFichier: dto.typeFichier,
        chemin,
        interventionId,
        etapeId: dto.etapeId,
      },
    });
  }

  async findAll(interventionId: number, user: AuthenticatedUser) {
    const intervention = await this.getInterventionOrThrow(interventionId);
    assertCanViewIntervention(user, intervention);
    return this.prisma.pieceJointe.findMany({
      where: { interventionId },
      orderBy: { dateAjout: 'desc' },
    });
  }

  async remove(interventionId: number, id: number, user: AuthenticatedUser) {
    const intervention = await this.getInterventionOrThrow(interventionId);
    assertCanActOnIntervention(user, intervention);
    const piece = await this.prisma.pieceJointe.findUnique({ where: { id } });
    if (!piece || piece.interventionId !== interventionId) {
      throw new NotFoundException(`Pièce jointe ${id} introuvable pour cette intervention`);
    }
    await this.prisma.pieceJointe.delete({ where: { id } });
    return { success: true };
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

  private async getEtapeOrThrow(interventionId: number, etapeId: number) {
    const etape = await this.prisma.etapeIntervention.findUnique({ where: { id: etapeId } });
    if (!etape || etape.interventionId !== interventionId) {
      throw new NotFoundException(`Étape ${etapeId} introuvable pour cette intervention`);
    }
    return etape;
  }
}
