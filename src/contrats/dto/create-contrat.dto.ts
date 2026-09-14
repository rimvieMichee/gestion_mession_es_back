import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateContratDto {
  /** Référence du contrat */
  @ApiProperty({ example: 'CTR-2026-014' })
  @IsString()
  reference: string;

  /** Type de SLA associé */
  @ApiPropertyOptional({ example: 'Standard 8h/5j' })
  @IsOptional()
  @IsString()
  typeSla?: string;

  /** Date de début du contrat (ISO 8601) */
  @ApiProperty({ example: '2026-01-01' })
  @IsDateString()
  dateDebut: string;

  /** Date de fin du contrat (ISO 8601) */
  @ApiProperty({ example: '2026-12-31' })
  @IsDateString()
  dateFin: string;

  /** Client concerné */
  @ApiProperty({ example: 1, description: 'id_client' })
  @IsInt()
  clientId: number;
}
