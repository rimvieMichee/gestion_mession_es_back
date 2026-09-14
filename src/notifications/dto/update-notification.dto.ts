import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateNotificationDto {
  /** Marquer la notification comme lue (ou non lue) */
  @ApiProperty({ example: true })
  @IsBoolean()
  lu: boolean;
}
