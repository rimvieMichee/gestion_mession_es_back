import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AuthenticatedUserSummaryEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Kaboré' })
  nom: string;

  @ApiProperty({ example: 'Awa' })
  prenom: string;

  @ApiProperty({ example: 'awa.kabore@sahelys.com' })
  email: string;

  /** Libellé du rôle */
  @ApiProperty({ example: 'Administrateur' })
  role: string;

  @ApiPropertyOptional({ type: Number, example: null, nullable: true, description: 'id_client' })
  clientId: number | null;
}

export class LoginResponseEntity {
  /** Jeton JWT à utiliser dans l'en-tête Authorization: Bearer */
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ type: AuthenticatedUserSummaryEntity })
  user: AuthenticatedUserSummaryEntity;
}
