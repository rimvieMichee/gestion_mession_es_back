import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { ROLES } from '../common/constants/roles.constant';
import { StatutIntervention, TypeSignataire } from '../../generated/prisma/enums';
import { assertCanViewIntervention } from '../interventions/interventions.authorization';
import { CreateSignatureDto } from './dto/create-signature.dto';

@Injectable()
export class SignaturesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(interventionId: number, dto: CreateSignatureDto, user: AuthenticatedUser) {
    const intervention = await this.getInterventionOrThrow(interventionId);
    this.assertCanSign(user, intervention, dto.typeSignataire);

    const signature = await this.prisma.signature.create({
      data: { ...dto, interventionId },
    });

    // Règle de gestion (section 3.3) : la signature du client valide la fiche.
    if (
      dto.typeSignataire === TypeSignataire.CLIENT &&
      intervention.statut === StatutIntervention.EN_ATTENTE_VALIDATION_CLIENT
    ) {
      await this.prisma.intervention.update({
        where: { id: interventionId },
        data: { statut: StatutIntervention.VALIDEE },
      });
      await this.prisma.historiqueStatut.create({
        data: {
          interventionId,
          statut: StatutIntervention.VALIDEE,
          utilisateurId: user.sub,
        },
      });
    }

    return signature;
  }

  async findAll(interventionId: number, user: AuthenticatedUser) {
    const intervention = await this.getInterventionOrThrow(interventionId);
    assertCanViewIntervention(user, intervention);
    return this.prisma.signature.findMany({
      where: { interventionId },
      orderBy: { dateHeure: 'desc' },
    });
  }

  private assertCanSign(
    user: AuthenticatedUser,
    intervention: { clientId: number; responsableId: number; techniciens: { technicienId: number }[] },
    typeSignataire: TypeSignataire,
  ): void {
    const staffRoles: string[] = [ROLES.ADMINISTRATEUR, ROLES.RESPONSABLE_TECHNIQUE, ROLES.CHEF_DE_PROJET];
    if (staffRoles.includes(user.role)) return;

    const isTechnicienSurIntervention =
      intervention.responsableId === user.sub ||
      intervention.techniciens.some((t) => t.technicienId === user.sub);
    if (user.role === ROLES.TECHNICIEN && isTechnicienSurIntervention) return;

    if (
      typeSignataire === TypeSignataire.CLIENT &&
      user.role === ROLES.CLIENT &&
      user.clientId === intervention.clientId
    ) {
      return;
    }

    throw new ForbiddenException("Vous n'êtes pas autorisé à signer cette intervention");
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
}
