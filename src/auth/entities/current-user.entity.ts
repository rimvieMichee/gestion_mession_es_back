import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CurrentUserEntity {
  /** Identifiant de l'utilisateur (sub du JWT) */
  @ApiProperty({ example: 1 })
  sub: number;

  @ApiProperty({ example: 'awa.kabore@sahelys.com' })
  email: string;

  /** Libellé du rôle */
  @ApiProperty({ example: 'Administrateur' })
  role: string;

  @ApiProperty({ example: 6, description: 'id_role' })
  roleId: number;

  @ApiPropertyOptional({ type: Number, example: null, nullable: true, description: 'id_client' })
  clientId: number | null;

  @ApiProperty({ example: 1789382749 })
  iat: number;

  @ApiProperty({ example: 1789411549 })
  exp: number;
}
