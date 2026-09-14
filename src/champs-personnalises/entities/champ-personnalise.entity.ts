import { ApiProperty } from '@nestjs/swagger';

export class ChampPersonnaliseEntity {
  @ApiProperty({ example: 1 })
  id: number;

  /** Intitulé du champ */
  @ApiProperty({ example: 'Numéro de série remplacé' })
  libelle: string;

  /** Type de donnée attendu */
  @ApiProperty({ example: 'texte', description: 'Texte, nombre, date, liste, booléen, etc.' })
  typeDonnee: string;

  /** Champ obligatoire ou non */
  @ApiProperty({ example: false })
  obligatoire: boolean;

  /** Type de fiche associé */
  @ApiProperty({ example: 1, description: 'id_type_fiche' })
  typeFicheId: number;
}
