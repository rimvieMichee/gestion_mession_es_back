import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  /** Contenu du message */
  @ApiProperty({ example: 'Une nouvelle intervention vous a été affectée : INT-2026-00042' })
  @IsString()
  message: string;

  /** Utilisateur destinataire */
  @ApiProperty({ example: 3, description: 'id_utilisateur' })
  @IsInt()
  utilisateurId: number;

  /** Intervention liée (optionnelle) */
  @ApiPropertyOptional({ example: 1, description: 'id_intervention' })
  @IsOptional()
  @IsInt()
  interventionId?: number;
}
