import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  /** Email de connexion de l'utilisateur */
  @ApiProperty({ example: 'awa.kabore@sahelys.com', description: 'Email de connexion' })
  @IsEmail()
  email: string;

  /** Mot de passe de l'utilisateur */
  @ApiProperty({ example: 'ChangeMe123!', description: 'Mot de passe' })
  @IsString()
  motDePasse: string;
}
