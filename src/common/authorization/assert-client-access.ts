import { ForbiddenException } from '@nestjs/common';
import { ROLES } from '../constants/roles.constant';
import type { AuthenticatedUser } from '../../auth/types/jwt-payload.type';

/**
 * Un utilisateur de profil Client ne peut consulter que les ressources de
 * son propre client (id_client) ; les rôles internes (staff) voient tout.
 */
export function assertClientAccess(user: AuthenticatedUser, clientId: number): void {
  if (user.role === ROLES.CLIENT && user.clientId !== clientId) {
    throw new ForbiddenException("Accès réservé aux ressources de votre organisation");
  }
}

/**
 * Calcule le filtre id_client à appliquer à une liste : un profil Client est
 * toujours restreint à son propre client (le paramètre de requête est ignoré),
 * un profil interne (staff) peut filtrer librement ou tout voir.
 */
export function resolveClientScope(
  user: AuthenticatedUser,
  requestedClientId?: number,
): number | undefined {
  if (user.role === ROLES.CLIENT) {
    return user.clientId ?? -1;
  }
  return requestedClientId;
}
