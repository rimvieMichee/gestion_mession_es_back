import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateChampPersonnaliseDto {
  /** Intitulé du champ affiché dans le formulaire dynamique */
  @ApiProperty({ example: 'Numéro de série remplacé' })
  @IsString()
  libelle: string;

  /** Type de donnée attendu (texte, nombre, date, liste, booléen...) */
  @ApiProperty({ example: 'texte', description: 'Texte, nombre, date, liste, booléen, etc.' })
  @IsString()
  typeDonnee: string;

  /** Le champ est-il obligatoire à la saisie ? */
  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  obligatoire?: boolean;

  /** Type de fiche auquel ce champ est rattaché */
  @ApiProperty({ example: 1, description: 'id_type_fiche' })
  @IsInt()
  typeFicheId: number;
}
