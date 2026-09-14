import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleEntity } from '../../roles/entities/role.entity';

class ClientSummaryEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Office National Eau' })
  nom: string;
}

/** Représentation publique d'un utilisateur (le mot de passe n'est jamais renvoyé). */
export class UserEntity {
  @ApiProperty({ example: 1 })
  id: number;

  /** Nom de famille */
  @ApiProperty({ example: 'Kaboré' })
  nom: string;

  /** Prénom */
  @ApiProperty({ example: 'Awa' })
  prenom: string;

  /** Email de connexion */
  @ApiProperty({ example: 'awa.kabore@sahelys.com' })
  email: string;

  @ApiProperty({ example: 6, description: 'id_role' })
  roleId: number;

  @ApiPropertyOptional({ type: Number, example: null, nullable: true, description: 'id_client' })
  clientId: number | null;

  @ApiProperty({ type: RoleEntity })
  role: RoleEntity;

  @ApiPropertyOptional({ type: ClientSummaryEntity, nullable: true })
  client: ClientSummaryEntity | null;

  @ApiProperty({ example: '2026-09-14T10:45:23.564Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-09-14T10:45:23.564Z' })
  updatedAt: Date;
}
