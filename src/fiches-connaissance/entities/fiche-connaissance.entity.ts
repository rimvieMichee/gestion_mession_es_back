import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FicheConnaissanceEntity {
  @ApiProperty({ example: 1 })
  id: number;

  /** Problème rencontré */
  @ApiProperty({ example: 'Coupures reseau intermittentes sur le site du siege' })
  probleme: string;

  /** Diagnostic établi */
  @ApiProperty({ example: 'Cable reseau endommage au niveau de la baie de brassage' })
  diagnostic: string;

  /** Cause identifiée */
  @ApiPropertyOptional({ type: String, example: "Usure du cable due a l'humidite", nullable: true })
  cause: string | null;

  /** Solution appliquée */
  @ApiProperty({ example: 'Remplacement du cable et deplacement hors zone humide' })
  solution: string;

  /** Procédure à suivre en cas de récurrence */
  @ApiPropertyOptional({
    type: String,
    example: '1. Verifier la baie de brassage. 2. Tester chaque cable. 3. Remplacer si besoin.',
    nullable: true,
  })
  procedure: string | null;

  /** Recommandation associée */
  @ApiPropertyOptional({
    type: String,
    example: 'Installer un deshumidificateur dans la salle serveur',
    nullable: true,
  })
  recommandation: string | null;

  /** Intervention d'origine */
  @ApiProperty({ example: 1, description: 'id_intervention' })
  interventionId: number;

  /** Équipement concerné */
  @ApiPropertyOptional({ type: Number, example: 1, description: 'id_equipement', nullable: true })
  equipementId: number | null;

  /** Application concernée */
  @ApiPropertyOptional({ type: Number, example: 1, description: 'id_application', nullable: true })
  applicationId: number | null;

  @ApiProperty({ example: '2026-09-14T11:28:33.297Z' })
  createdAt: Date;
}
