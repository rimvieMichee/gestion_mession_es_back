import { RoleLibelle } from '../../common/constants/roles.constant';

export interface JwtPayload {
  sub: number;
  email: string;
  role: RoleLibelle;
  roleId: number;
  clientId: number | null;
}

/** Ce que `req.user` contient après validation du JWT (voir JwtStrategy). */
export type AuthenticatedUser = JwtPayload;
