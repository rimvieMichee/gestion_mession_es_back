import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginResponseEntity } from './entities/login-response.entity';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import type { AuthenticatedUser } from './types/jwt-payload.type';
import { AuthService } from './auth.service';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Se connecter et obtenir un jeton JWT' })
  @ApiOkResponse({ description: 'Connexion réussie, jeton JWT renvoyé.', type: LoginResponseEntity })
  @ApiUnauthorizedResponse({ description: 'Email ou mot de passe invalide.' })
  login(@Body() dto: LoginDto): Promise<LoginResponseEntity> {
    return this.authService.login(dto.email, dto.motDePasse);
  }

  @ApiBearerAuth('JWT-auth')
  @Get('me')
  @ApiOperation({ summary: "Récupérer le profil complet de l'utilisateur actuellement connecté" })
  @ApiOkResponse({ type: UserEntity })
  me(@Req() req: Request & { user: AuthenticatedUser }): Promise<UserEntity> {
    return this.usersService.findOne(req.user.sub);
  }

  @ApiBearerAuth('JWT-auth')
  @Patch('me')
  @ApiOperation({ summary: 'Modifier son propre profil (nom, prénom, email) — pas de changement de rôle possible ici' })
  @ApiOkResponse({ type: UserEntity })
  updateMe(
    @Req() req: Request & { user: AuthenticatedUser },
    @Body() dto: UpdateMeDto,
  ): Promise<UserEntity> {
    return this.usersService.update(req.user.sub, dto);
  }
}
