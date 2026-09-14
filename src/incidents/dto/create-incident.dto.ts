import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { NiveauCriticite } from '../../../generated/prisma/enums';

export class CreateIncidentDto {
  /** Description de l'incident */
  @ApiProperty({
    example: "Coupure electrique repetee sur l'onduleur de la salle serveur",
  })
  @IsString()
  description: string;

  /** Niveau de criticité de l'incident */
  @ApiProperty({ enum: NiveauCriticite, example: NiveauCriticite.ELEVE })
  @IsEnum(NiveauCriticite)
  niveauCriticite: NiveauCriticite;

  /** Équipement concerné (optionnel, doit appartenir au client de l'intervention) */
  @ApiPropertyOptional({ example: 1, description: 'id_equipement' })
  @IsOptional()
  @IsInt()
  equipementId?: number;

  /** Application concernée (optionnelle, doit appartenir au client de l'intervention) */
  @ApiPropertyOptional({ example: 1, description: 'id_application' })
  @IsOptional()
  @IsInt()
  applicationId?: number;
}
