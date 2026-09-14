import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TypeSignataire } from '../../../generated/prisma/enums';

export class CreateSignatureDto {
  /** Qui signe : le technicien ou le client */
  @ApiProperty({ enum: TypeSignataire, example: TypeSignataire.CLIENT })
  @IsEnum(TypeSignataire)
  typeSignataire: TypeSignataire;

  /** Nom du signataire */
  @ApiProperty({ example: 'Aminata Sawadogo' })
  @IsString()
  nomSignataire: string;

  /** Fonction du signataire (si client) */
  @ApiPropertyOptional({ example: "Directrice des systèmes d'information" })
  @IsOptional()
  @IsString()
  fonction?: string;

  /**
   * Chemin ou URL de l'image de signature déjà stockée (capture réalisée côté
   * mobile/web, le téléversement du binaire se fait via un service dédié).
   */
  @ApiProperty({
    example: 'https://storage.sahelys.com/interventions/INT-2026-00042/signature-client.png',
  })
  @IsString()
  imageSignature: string;
}
