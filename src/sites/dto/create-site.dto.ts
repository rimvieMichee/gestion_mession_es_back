import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateSiteDto {
  /** Nom du site */
  @ApiProperty({ example: 'Direction régionale du Centre' })
  @IsString()
  nom: string;

  /** Adresse du site */
  @ApiProperty({ example: 'Secteur 15, Avenue de la Liberté, Ouagadougou' })
  @IsString()
  adresse: string;

  /** Client propriétaire du site */
  @ApiProperty({ example: 1, description: 'id_client' })
  @IsInt()
  clientId: number;
}
