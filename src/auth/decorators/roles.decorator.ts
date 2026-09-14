import { SetMetadata } from '@nestjs/common';
import { RoleLibelle } from '../../common/constants/roles.constant';

export const ROLES_KEY = 'roles';

/** Restreint une route aux utilisateurs ayant l'un des rôles listés. */
export const Roles = (...roles: RoleLibelle[]) => SetMetadata(ROLES_KEY, roles);
