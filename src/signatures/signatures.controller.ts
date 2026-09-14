import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/jwt-payload.type';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { SignatureEntity } from './entities/signature.entity';
import { SignaturesService } from './signatures.service';

@ApiTags('Signatures')
@ApiBearerAuth('JWT-auth')
@Controller('interventions/:interventionId/signatures')
export class SignaturesController {
  constructor(private readonly signaturesService: SignaturesService) {}

  @Post()
  @ApiOperation({
    summary: 'Ajouter une signature électronique (technicien ou client)',
    description:
      "La signature du client fait automatiquement passer l'intervention au statut Validée si elle était en attente de validation.",
  })
  @ApiCreatedResponse({ type: SignatureEntity })
  create(
    @Param('interventionId', ParseIntPipe) interventionId: number,
    @Body() dto: CreateSignatureDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<SignatureEntity> {
    return this.signaturesService.create(interventionId, dto, user);
  }

  @Get()
  @ApiOperation({ summary: "Lister les signatures d'une intervention" })
  @ApiOkResponse({ type: [SignatureEntity] })
  findAll(
    @Param('interventionId', ParseIntPipe) interventionId: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<SignatureEntity[]> {
    return this.signaturesService.findAll(interventionId, user);
  }
}
