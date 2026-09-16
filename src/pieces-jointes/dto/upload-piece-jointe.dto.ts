import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

/** Champs texte envoyés à côté du fichier binaire, en multipart/form-data. */
export class UploadPieceJointeDto {
  /** Type de fichier joint */
  @ApiProperty({ example: 'Photo', description: 'Photo, PDF, document, etc.' })
  @IsString()
  typeFichier: string;

  /** Étape de mission à laquelle rattacher cette pièce jointe, le cas échéant */
  @ApiPropertyOptional({ example: 2, description: 'id_etape' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  etapeId?: number;
}
