import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClientEntity {
  @ApiProperty({ example: 1 })
  id: number;

  /** Raison sociale du client */
  @ApiProperty({ example: "Office National de l'Eau et de l'Assainissement (ONEA)" })
  nom: string;

  /** Adresse du siège */
  @ApiProperty({ example: 'Avenue Kwame Nkrumah, 01 BP 170, Ouagadougou 01' })
  adresse: string;

  /** Secteur d'activité du client */
  @ApiPropertyOptional({ type: String, example: "Distribution d'eau potable", nullable: true })
  secteurActivite: string | null;

  /** Email de contact général */
  @ApiPropertyOptional({ type: String, example: 'contact@onea.bf', nullable: true })
  email: string | null;

  /** Téléphone de contact général */
  @ApiPropertyOptional({ type: String, example: '+226 25 32 42 42', nullable: true })
  telephone: string | null;

  @ApiProperty({ example: '2026-09-14T10:54:20.863Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-09-14T10:54:20.863Z' })
  updatedAt: Date;
}
