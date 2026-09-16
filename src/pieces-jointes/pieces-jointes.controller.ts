import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { SuccessResponseEntity } from '../common/entities/success-response.entity';
import { CreatePieceJointeDto } from './dto/create-piece-jointe.dto';
import { UploadPieceJointeDto } from './dto/upload-piece-jointe.dto';
import { PieceJointeEntity } from './entities/piece-jointe.entity';
import { PiecesJointesService } from './pieces-jointes.service';

@ApiTags('Pièces jointes')
@ApiBearerAuth('JWT-auth')
@Controller('interventions/:interventionId/pieces-jointes')
export class PiecesJointesController {
  constructor(private readonly piecesJointesService: PiecesJointesService) {}

  @Post()
  @ApiOperation({
    summary: 'Joindre une photo ou un document déjà hébergé (URL) à une intervention',
    description: "Pour téléverser un fichier réel depuis l'app, utiliser POST .../upload à la place.",
  })
  @ApiCreatedResponse({ type: PieceJointeEntity })
  create(
    @Param('interventionId', ParseIntPipe) interventionId: number,
    @Body() dto: CreatePieceJointeDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<PieceJointeEntity> {
    return this.piecesJointesService.create(interventionId, dto, user);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        typeFichier: { type: 'string', example: 'Photo' },
        etapeId: { type: 'integer', example: 2 },
      },
      required: ['file', 'typeFichier'],
    },
  })
  @ApiOperation({
    summary: 'Téléverser un fichier réel (photo/document) et l’attacher à l’intervention',
    description:
      "Envoie le binaire vers le stockage (Supabase Storage) puis crée la pièce jointe. Peut être rattachée à une étape de mission via `etapeId`.",
  })
  @ApiCreatedResponse({ type: PieceJointeEntity })
  upload(
    @Param('interventionId', ParseIntPipe) interventionId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadPieceJointeDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<PieceJointeEntity> {
    return this.piecesJointesService.upload(interventionId, file, dto, user);
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
