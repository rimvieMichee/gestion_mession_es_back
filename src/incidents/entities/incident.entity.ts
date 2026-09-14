import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NiveauCriticite, StatutIncident } from '../../../generated/prisma/enums';

export class IncidentEntity {
  @ApiProperty({ example: 1 })
  id: number;

  /** Description de l'incident */
  @ApiProperty({ example: "Coupure electrique repetee sur l'onduleur de la salle serveur" })
  description: string;

  @ApiProperty({ enum: NiveauCriticite, example: NiveauCriticite.ELEVE })
  niveauCriticite: NiveauCriticite;

  @ApiProperty({ enum: StatutIncident, example: StatutIncident.OUVERT })
  statut: StatutIncident;

  /** Intervention d'origine */
  @ApiProperty({ example: 1, description: 'id_intervention' })
  interventionId: number;

  /** Équipement concerné */
  @ApiPropertyOptional({ type: Number, example: 1, description: 'id_equipement', nullable: true })
  equipementId: number | null;

  /** Application concernée */
  @ApiPropertyOptional({ type: Number, example: 1, description: 'id_application', nullable: true })
  applicationId: number | null;

  @ApiProperty({ example: '2026-09-14T11:28:33.253Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-09-14T11:28:33.253Z' })
  updatedAt: Date;
}
