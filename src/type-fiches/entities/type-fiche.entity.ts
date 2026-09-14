import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChampPersonnaliseEntity } from '../../champs-personnalises/entities/champ-personnalise.entity';

export class TypeFicheEntity {
  @ApiProperty({ example: 1 })
  id: number;

  /** Nom du type de fiche */
  @ApiProperty({ example: 'Maintenance informatique' })
  libelle: string;

  /** Description du type de fiche */
  @ApiPropertyOptional({
    type: String,
    example: 'Intervention de maintenance sur un poste, serveur ou équipement réseau',
    nullable: true,
  })
  description: string | null;

  /** Champs dynamiques rattachés à ce type de fiche */
  @ApiPropertyOptional({ type: [ChampPersonnaliseEntity] })
  champsPersonnalises?: ChampPersonnaliseEntity[];
}
