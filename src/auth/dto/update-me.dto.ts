import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

/**
 * Mise à jour de son propre profil (auth/me). Volontairement restreint à
 * nom/prénom/email : contrairement à UpdateUserDto (réservé aux
 * administrateurs via /users), aucun champ roleId/clientId n'est exposé ici
 * pour empêcher un utilisateur de s'auto-promouvoir.
 */
export class UpdateMeDto {
  @ApiPropertyOptional({ example: 'Kaboré' })
  @IsOptional()
  @IsString()
  nom?: string;

  @ApiPropertyOptional({ example: 'Awa' })
  @IsOptional()
  @IsString()
  prenom?: string;

  @ApiPropertyOptional({ example: 'awa.kabore@sahelys.com' })
  @IsOptional()
  @IsEmail()
  email?: string;
}
