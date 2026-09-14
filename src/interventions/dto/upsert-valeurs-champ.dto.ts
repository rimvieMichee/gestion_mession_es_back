import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsString, ValidateNested } from 'class-validator';

class ValeurChampItem {
  /** Champ personnalisé concerné */
  @ApiProperty({ example: 1, description: 'id_champ' })
  @IsInt()
  champId: number;

  /** Valeur saisie (toujours transmise en texte, quel que soit le type_donnee du champ) */
  @ApiProperty({ example: 'SN-BF-2026-0999' })
  @IsString()
  valeur: string;
}

export class UpsertValeursChampDto {
  /** Liste des valeurs à enregistrer pour cette intervention */
  @ApiProperty({ type: [ValeurChampItem] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ValeurChampItem)
  valeurs: ValeurChampItem[];
}
