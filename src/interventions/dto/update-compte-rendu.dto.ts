import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCompteRenduDto {
  /** Travaux effectivement réalisés */
  @ApiPropertyOptional({
    example: "Redémarrage du switch principal et remplacement d'un câble réseau défectueux.",
  })
  @IsOptional()
  @IsString()
  travauxRealises?: string;

  /** Difficultés rencontrées */
  @ApiPropertyOptional({ example: "Accès à la baie de brassage retardé, salle serveur fermée à clé." })
  @IsOptional()
  @IsString()
  difficultesRencontrees?: string;

  /** Observations du technicien */
  @ApiPropertyOptional({ example: 'Le switch de secours mériterait un remplacement préventif.' })
  @IsOptional()
  @IsString()
  observationsTechnicien?: string;

  /** Observations du client */
  @ApiPropertyOptional({ example: 'Client satisfait, connexion rétablie sur tout le bâtiment.' })
  @IsOptional()
  @IsString()
  observationsClient?: string;

  /** Recommandations formulées */
  @ApiPropertyOptional({ example: "Prévoir le remplacement du switch de secours au 2e trimestre 2027." })
  @IsOptional()
  @IsString()
  recommandations?: string;
}
