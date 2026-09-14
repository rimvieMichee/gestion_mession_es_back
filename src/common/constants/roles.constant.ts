/**
 * Libellés de rôle canoniques (table ROLE du dossier technique, section 2).
 * La table Role reste éditable en base (l'Administrateur gère les rôles/droits),
 * mais ces 6 libellés sont ceux que l'application seed et vérifie explicitement.
 */
export const ROLES = {
  TECHNICIEN: 'Technicien',
  RESPONSABLE_TECHNIQUE: 'Responsable technique',
  CHEF_DE_PROJET: 'Chef de projet',
  DIRECTION: 'Direction',
  CLIENT: 'Client',
  ADMINISTRATEUR: 'Administrateur',
} as const;

export type RoleLibelle = (typeof ROLES)[keyof typeof ROLES];

/** Rôles internes habilités à gérer le référentiel (clients, sites, contrats...). */
export const STAFF_MANAGER_ROLES: RoleLibelle[] = [
  ROLES.ADMINISTRATEUR,
  ROLES.RESPONSABLE_TECHNIQUE,
  ROLES.CHEF_DE_PROJET,
];
