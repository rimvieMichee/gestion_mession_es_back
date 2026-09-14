import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NotificationEntity {
  @ApiProperty({ example: 1 })
  id: number;

  /** Contenu du message */
  @ApiProperty({ example: 'Une nouvelle intervention vous a été affectée : INT-2026-00042' })
  message: string;

  @ApiProperty({ example: '2026-09-14T11:28:33.368Z' })
  dateCreation: Date;

  /** Notification lue ou non */
  @ApiProperty({ example: false })
  lu: boolean;

  /** Utilisateur destinataire */
  @ApiProperty({ example: 3, description: 'id_utilisateur' })
  utilisateurId: number;

  /** Intervention liée */
  @ApiPropertyOptional({ type: Number, example: 1, description: 'id_intervention', nullable: true })
  interventionId: number | null;
}
