import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TypeSignataire } from '../../../generated/prisma/enums';

export class SignatureEntity {
  @ApiProperty({ example: 1 })
  id: number;

  /** Qui a signé */
  @ApiProperty({ enum: TypeSignataire, example: TypeSignataire.CLIENT })
  typeSignataire: TypeSignataire;

  /** Nom du signataire */
  @ApiProperty({ example: 'Aminata Sawadogo' })
  nomSignataire: string;

  /** Fonction du signataire (si client) */
  @ApiPropertyOptional({ type: String, example: "Directrice des systèmes d'information", nullable: true })
  fonction: string | null;

  /** Chemin ou URL de l'image de signature */
  @ApiProperty({
    example: 'https://storage.sahelys.com/interventions/INT-2026-00042/signature-client.png',
  })
  imageSignature: string;

  @ApiProperty({ example: '2026-09-14T11:28:33.253Z' })
  dateHeure: Date;

  /** Intervention concernée */
  @ApiProperty({ example: 1, description: 'id_intervention' })
  interventionId: number;
}
