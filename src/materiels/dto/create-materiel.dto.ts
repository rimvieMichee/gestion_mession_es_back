import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, Min } from 'class-validator';

export class CreateMaterielDto {
  /** Désignation de la pièce/du consommable */
  @ApiProperty({ example: 'Onduleur APC 1500VA' })
  @IsString()
  nom: string;

  /** Référence fournisseur (unique) */
  @ApiProperty({ example: 'APC-1500VA-BF' })
  @IsString()
  reference: string;

  /** Catégorie de rangement */
  @ApiProperty({ example: 'Alimentation électrique' })
  @IsString()
  categorie: string;

  /** Quantité en stock à la création */
  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(0)
  stockActuel: number;

  /** Seuil sous lequel le stock est considéré critique */
  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(0)
  seuilMin: number;

  /** Capacité maximale de stockage */
  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(0)
  seuilMax: number;

  /** Prix unitaire (FCFA) */
  @ApiProperty({ example: 85000 })
  @IsNumber()
  @Min(0)
  prixUnitaire: number;

  /** Fournisseur habituel */
  @ApiProperty({ example: 'Faso Informatique' })
  @IsString()
  fournisseur: string;

  /** Emplacement de stockage */
  @ApiProperty({ example: 'Entrepôt Ouagadougou - Rayon 3' })
  @IsString()
  emplacement: string;
}
