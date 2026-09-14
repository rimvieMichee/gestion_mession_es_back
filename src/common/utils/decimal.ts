import type { Prisma } from '../../../generated/prisma/client';

/**
 * Prisma renvoie les colonnes Decimal comme des instances Decimal.js, qui se
 * sérialisent en JSON sous forme de chaîne ("45" au lieu de 45). On les
 * convertit explicitement en number pour que l'API reste cohérente avec les
 * DTOs d'entrée (qui déclarent ces champs comme number).
 */
export function decimalToNumber(value: Prisma.Decimal | null): number | null {
  return value === null ? null : Number(value);
}
