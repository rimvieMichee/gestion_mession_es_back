import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RoleLibelle } from '../common/constants/roles.constant';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, motDePasse: string) {
    const user = await this.usersService.findByEmailWithCredentials(email);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const passwordMatches = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!passwordMatches) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    return user;
  }

  async login(email: string, motDePasse: string) {
    const user = await this.validateUser(email, motDePasse);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role.libelle as RoleLibelle,
      roleId: user.roleId,
      clientId: user.clientId,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role.libelle,
        clientId: user.clientId,
      },
    };
  }
}
