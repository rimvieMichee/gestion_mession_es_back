import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
import { isLocalDatabase } from '../common/utils/is-local-database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    super({
      adapter: new PrismaPg({
        connectionString,
        // Supabase (et la plupart des Postgres managés) exigent TLS avec un
        // certificat qui ne remonte pas à une CA locale de confiance ; il faut
        // le dire explicitement au driver node-postgres (un simple ?sslmode=
        // require dans l'URL ne suffit pas ici, contrairement à psql).
        ssl: isLocalDatabase(connectionString) ? undefined : { rejectUnauthorized: false },
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
