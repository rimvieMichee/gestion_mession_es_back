import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateFicheConnaissanceDto {
  /** Problème rencontré */
  @ApiProperty({ example: "Coupures reseau intermittentes sur le site du siege" })
  @IsString()
  probleme: string;

  /** Diagnostic établi */
  @ApiProperty({ example: 'Cable reseau endommage au niveau de la baie de brassage' })
  @IsString()
  diagnostic: string;

  /** Cause identifiée */
  @ApiPropertyOptional({ example: "Usure du cable due a l'humidite de la salle serveur" })
  @IsOptional()
  @IsString()
  cause?: string;

  /** Solution appliquée */
  @ApiProperty({ example: 'Remplacement du cable et deplacement hors zone humide' })
  @IsString()
  solution: string;

  /** Procédure à suivre en cas de récurrence */
  @ApiPropertyOptional({
    example: '1. Verifier la baie de brassage. 2. Tester chaque cable au testeur. 3. Remplacer si besoin.',
  })
  @IsOptional()
  @IsString()
  procedure?: string;

  /** Recommandation associée */
  @ApiPropertyOptional({ example: 'Installer un deshumidificateur dans la salle serveur' })
  @IsOptional()
  @IsString()
  recommandation?: string;

  /** Équipement concerné (optionnel) */
  @ApiPropertyOptional({ example: 1, description: 'id_equipement' })
  @IsOptional()
  @IsInt()
  equipementId?: number;

  /** Application concernée (optionnelle) */
  @ApiPropertyOptional({ example: 1, description: 'id_application' })
  @IsOptional()
  @IsInt()
  applicationId?: number;
}
