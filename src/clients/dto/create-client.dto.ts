import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  /** Raison sociale du client */
  @ApiProperty({ example: "Office National de l'Eau et de l'Assainissement (ONEA)" })
  @IsString()
  nom: string;

  /** Adresse du siège */
  @ApiProperty({ example: 'Avenue Kwame Nkrumah, 01 BP 170, Ouagadougou 01' })
  @IsString()
  adresse: string;

  /** Secteur d'activité du client */
  @ApiPropertyOptional({ example: "Distribution d'eau potable" })
  @IsOptional()
  @IsString()
  secteurActivite?: string;

  /** Email de contact général */
  @ApiPropertyOptional({ example: 'contact@onea.bf' })
  @IsOptional()
  @IsEmail()
  email?: string;

  /** Téléphone de contact général */
  @ApiPropertyOptional({ example: '+226 25 32 42 42' })
  @IsOptional()
  @IsString()
  telephone?: string;
}
