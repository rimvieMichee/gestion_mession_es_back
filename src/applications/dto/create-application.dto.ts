import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateApplicationDto {
  /** Nom de l'application */
  @ApiProperty({ example: 'Portail Client ONEA' })
  @IsString()
  nom: string;

  /** Version courante */
  @ApiPropertyOptional({ example: '2.3.1' })
  @IsOptional()
  @IsString()
  version?: string;

  /** Client concerné */
  @ApiProperty({ example: 1, description: 'id_client' })
  @IsInt()
  clientId: number;
}
