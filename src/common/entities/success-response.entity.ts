import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseEntity {
  /** Confirmation que l'opération a réussi */
  @ApiProperty({ example: true })
  success: boolean;
}
