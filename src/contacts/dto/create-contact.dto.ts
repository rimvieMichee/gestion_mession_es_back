import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  /** Nom du contact */
  @ApiProperty({ example: 'Sawadogo' })
  @IsString()
  nom: string;

  /** Fonction occupée */
  @ApiPropertyOptional({ example: 'Directrice des systèmes d\'information' })
  @IsOptional()
  @IsString()
  fonction?: string;

  /** Email du contact */
  @ApiPropertyOptional({ example: 'a.sawadogo@onea.bf' })
  @IsOptional()
  @IsEmail()
  email?: string;

  /** Téléphone du contact */
  @ApiPropertyOptional({ example: '+226 70 25 14 63' })
  @IsOptional()
  @IsString()
  telephone?: string;

  /** Client rattaché */
  @ApiProperty({ example: 1, description: 'id_client' })
  @IsInt()
  clientId: number;
}
