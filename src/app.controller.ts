import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { Public } from './auth/decorators/public.decorator';
import { HealthEntity } from './health.entity';

@ApiTags('Technique')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Message d'accueil de l'API" })
  @ApiOkResponse({ type: String })
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  @ApiOperation({ summary: "Vérifier que l'API et la base de données répondent" })
  @ApiOkResponse({ type: HealthEntity })
  async health(): Promise<HealthEntity> {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', database: 'up' };
  }
}
