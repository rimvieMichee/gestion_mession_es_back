import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { SuccessResponseEntity } from '../common/entities/success-response.entity';
import { CreatePieceJointeDto } from './dto/create-piece-jointe.dto';
import { PieceJointeEntity } from './entities/piece-jointe.entity';
import { PiecesJointesService } from './pieces-jointes.service';

@ApiTags('Pièces jointes')
@ApiBearerAuth('JWT-auth')
@Controller('interventions/:interventionId/pieces-jointes')
export class PiecesJointesController {
  constructor(private readonly piecesJointesService: PiecesJointesService) {}

  @Post()
  @ApiOperation({ summary: 'Joindre une photo ou un document à une intervention' })
  @ApiCreatedResponse({ type: PieceJointeEntity })
  create(
    @Param('interventionId', ParseIntPipe) interventionId: number,
    @Body() dto: CreatePieceJointeDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<PieceJointeEntity> {
    return this.piecesJointesService.create(interventionId, dto, user);
  }

  @Get()
  @ApiOperation({ summary: "Lister les pièces jointes d'une intervention" })
  @ApiOkResponse({ type: [PieceJointeEntity] })
  findAll(
    @Param('interventionId', ParseIntPipe) interventionId: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<PieceJointeEntity[]> {
    return this.piecesJointesService.findAll(interventionId, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une pièce jointe' })
  @ApiOkResponse({ type: SuccessResponseEntity })
  remove(
    @Param('interventionId', ParseIntPipe) interventionId: number,
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<SuccessResponseEntity> {
    return this.piecesJointesService.remove(interventionId, id, user);
  }
}
