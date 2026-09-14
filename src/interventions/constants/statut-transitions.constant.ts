import { StatutIntervention } from '../../../generated/prisma/enums';

/**
 * Transitions autorisées du cycle de vie d'une intervention
 * (dossier technique, section 6 — diagramme d'état).
 */
export const STATUT_TRANSITIONS: Record<StatutIntervention, StatutIntervention[]> = {
  NOUVELLE: ['PLANIFIEE'],
  PLANIFIEE: ['AFFECTEE'],
  AFFECTEE: ['EN_COURS'],
  EN_COURS: ['EN_ATTENTE', 'TERMINEE'],
  EN_ATTENTE: ['EN_COURS'],
  TERMINEE: ['EN_ATTENTE_VALIDATION_CLIENT'],
  EN_ATTENTE_VALIDATION_CLIENT: ['VALIDEE'],
  VALIDEE: ['CLOTUREE'],
  CLOTUREE: [],
};
