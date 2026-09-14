import { ForbiddenException } from '@nestjs/common';
import type { Prisma } from '../../generated/prisma/client';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { ROLES } from '../common/constants/roles.constant';
import type { FilterInterventionsDto } from './dto/filter-interventions.dto';

/** Un client ne voit que ses propres interventions, un technicien que les siennes. */
export function buildInterventionsWhere(
  user: AuthenticatedUser,
  filter: FilterInterventionsDto,
): Prisma.InterventionWhereInput {
  const where: Prisma.InterventionWhereInput = {};

  if (filter.statut) {
    where.statut = filter.statut;
  }

  if (user.role === ROLES.CLIENT) {
    where.clientId = user.clientId ?? -1;
    return where;
  }

  if (user.role === ROLES.TECHNICIEN) {
    where.OR = [
      { responsableId: user.sub },
      { techniciens: { some: { technicienId: user.sub } } },
    ];
    return where;
  }

  // Rôles internes (Administrateur, Responsable technique, Chef de projet, Direction)
  if (filter.clientId !== undefined) {
    where.clientId = filter.clientId;
  }
  if (filter.technicienId !== undefined) {
    where.techniciens = { some: { technicienId: filter.technicienId } };
  }
  return where;
}

interface InterventionParticipants {
  clientId: number;
  responsableId: number;
  techniciens: { technicienId: number }[];
}

/** Vérifie qu'un utilisateur a le droit de consulter une intervention donnée. */
export function assertCanViewIntervention(
  user: AuthenticatedUser,
  intervention: InterventionParticipants,
): void {
  if (user.role === ROLES.CLIENT && intervention.clientId !== user.clientId) {
    throw new ForbiddenException("Accès réservé aux interventions de votre organisation");
  }
  if (user.role === ROLES.TECHNICIEN && !isAssignedOrResponsable(user, intervention)) {
    throw new ForbiddenException(
      "Accès réservé aux interventions dont vous êtes responsable ou technicien affecté",
    );
  }
}

/** Vérifie qu'un utilisateur a le droit d'agir sur une intervention (statut, compte-rendu...). */
export function assertCanActOnIntervention(
  user: AuthenticatedUser,
  intervention: InterventionParticipants,
): void {
  const staffRoles: string[] = [ROLES.ADMINISTRATEUR, ROLES.RESPONSABLE_TECHNIQUE, ROLES.CHEF_DE_PROJET];
  if (staffRoles.includes(user.role)) {
    return;
  }
  if (user.role === ROLES.TECHNICIEN && isAssignedOrResponsable(user, intervention)) {
    return;
  }
  throw new ForbiddenException("Vous n'êtes pas autorisé à agir sur cette intervention");
}

function isAssignedOrResponsable(
  user: AuthenticatedUser,
  intervention: InterventionParticipants,
): boolean {
  return (
    intervention.responsableId === user.sub ||
    intervention.techniciens.some((t) => t.technicienId === user.sub)
  );
}
