import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class AssignTechnicienDto {
  /** Technicien à mobiliser sur l'intervention */
  @ApiProperty({ example: 3, description: 'id_utilisateur du technicien' })
  @IsInt()
  technicienId: number;

  /** Rôle du technicien sur cette intervention (optionnel) */
  @ApiPropertyOptional({ example: 'Intervenant principal' })
  @IsOptional()
  @IsString()
  roleSurIntervention?: string;
}
