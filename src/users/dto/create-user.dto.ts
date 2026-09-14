import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  /** Nom de famille de l'utilisateur */
  @ApiProperty({ example: 'Kaboré' })
  @IsString()
  nom: string;

  /** Prénom de l'utilisateur */
  @ApiProperty({ example: 'Awa' })
  @IsString()
  prenom: string;

  /** Email de connexion (unique) */
  @ApiProperty({ example: 'awa.kabore@sahelys.com' })
  @IsEmail()
  email: string;

  /** Mot de passe en clair (sera hashé avant stockage) */
  @ApiProperty({ example: 'MotDePasseSecurise123!' })
  @IsString()
  @MinLength(8)
  motDePasse: string;

  /** Identifiant du rôle attribué (voir GET /users pour la liste des rôles) */
  @ApiProperty({ example: 1, description: 'id_role — Technicien=1, Responsable technique=2, Chef de projet=3, Direction=4, Client=5, Administrateur=6' })
  @IsInt()
  roleId: number;

  /** Client rattaché, uniquement pour un utilisateur de profil "Client" */
  @ApiPropertyOptional({ example: 1, description: 'id_client — uniquement pour un profil Client' })
  @IsOptional()
  @IsInt()
  clientId?: number;
}
