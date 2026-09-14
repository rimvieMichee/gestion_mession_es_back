import { ApiProperty } from '@nestjs/swagger';

export class RoleEntity {
  @ApiProperty({ example: 6 })
  id: number;

  /** Libellé du rôle */
  @ApiProperty({ example: 'Administrateur' })
  libelle: string;
}
