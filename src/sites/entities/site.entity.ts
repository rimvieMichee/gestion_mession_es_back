import { ApiProperty } from '@nestjs/swagger';

export class SiteEntity {
  @ApiProperty({ example: 1 })
  id: number;

  /** Nom du site */
  @ApiProperty({ example: 'Direction régionale du Centre' })
  nom: string;

  /** Adresse du site */
  @ApiProperty({ example: 'Secteur 15, Avenue de la Liberté, Ouagadougou' })
  adresse: string;

  /** Client propriétaire du site */
  @ApiProperty({ example: 1, description: 'id_client' })
  clientId: number;
}
