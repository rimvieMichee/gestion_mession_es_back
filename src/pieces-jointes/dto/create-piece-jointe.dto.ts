import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePieceJointeDto {
  /** Type de fichier joint */
  @ApiProperty({ example: 'Photo', description: 'Photo, PDF, document, etc.' })
  @IsString()
  typeFichier: string;

  /**
   * Chemin ou URL du fichier déjà stocké (le téléversement effectif du binaire
   * se fait via un service de stockage dédié, hors de ce endpoint).
   */
  @ApiProperty({
    example: 'https://storage.sahelys.com/interventions/INT-2026-00042/photo-avant.jpg',
  })
  @IsString()
  chemin: string;
}
