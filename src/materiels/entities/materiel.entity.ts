import { ApiProperty } from '@nestjs/swagger';

export class MaterielEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Onduleur APC 1500VA' })
  nom: string;

  @ApiProperty({ example: 'APC-1500VA-BF' })
  reference: string;

  @ApiProperty({ example: 'Alimentation électrique' })
  categorie: string;

  @ApiProperty({ example: 10 })
  stockActuel: number;

  @ApiProperty({ example: 3 })
  seuilMin: number;

  @ApiProperty({ example: 20 })
  seuilMax: number;

  @ApiProperty({ example: 85000, description: 'Prix unitaire en FCFA' })
  prixUnitaire: number;

  @ApiProperty({ example: 'Faso Informatique' })
  fournisseur: string;

  @ApiProperty({ example: 'Entrepôt Ouagadougou - Rayon 3' })
  emplacement: string;

  @ApiProperty({ example: '2026-09-14T10:45:23.564Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-09-14T10:45:23.564Z' })
  updatedAt: Date;
}
