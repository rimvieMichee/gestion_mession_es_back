import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { CurrentUserEntity } from './entities/current-user.entity';
import { LoginResponseEntity } from './entities/login-response.entity';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import type { AuthenticatedUser } from './types/jwt-payload.type';
import { AuthService } from './auth.service';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  @ApiOperation({ summary: "Récupérer l'identité de l'utilisateur actuellement connecté" })
  @ApiOkResponse({ type: CurrentUserEntity })
  me(@Req() req: Request & { user: AuthenticatedUser }): AuthenticatedUser {
    return req.user;
  }
}
