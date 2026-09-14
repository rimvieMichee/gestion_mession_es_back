import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContactEntity {
  @ApiProperty({ example: 1 })
  id: number;

  /** Nom du contact */
  @ApiProperty({ example: 'Sawadogo' })
  nom: string;

  /** Fonction occupée */
  @ApiPropertyOptional({ type: String, example: "Directrice des systèmes d'information", nullable: true })
  fonction: string | null;

  /** Email du contact */
  @ApiPropertyOptional({ type: String, example: 'a.sawadogo@onea.bf', nullable: true })
  email: string | null;

  /** Téléphone du contact */
  @ApiPropertyOptional({ type: String, example: '+226 70 25 14 63', nullable: true })
  telephone: string | null;

  /** Client rattaché */
  @ApiProperty({ example: 1, description: 'id_client' })
  clientId: number;
}
