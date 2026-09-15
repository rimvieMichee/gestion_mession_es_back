import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { SitesModule } from './sites/sites.module';
import { ContactsModule } from './contacts/contacts.module';
import { ContratsModule } from './contrats/contrats.module';
import { ProjetsModule } from './projets/projets.module';
import { EquipementsModule } from './equipements/equipements.module';
import { ApplicationsModule } from './applications/applications.module';
import { TypeFichesModule } from './type-fiches/type-fiches.module';
import { ChampsPersonnalisesModule } from './champs-personnalises/champs-personnalises.module';
import { InterventionsModule } from './interventions/interventions.module';
import { PiecesJointesModule } from './pieces-jointes/pieces-jointes.module';
import { SignaturesModule } from './signatures/signatures.module';
import { RolesModule } from './roles/roles.module';
import { IncidentsModule } from './incidents/incidents.module';
import { FichesConnaissanceModule } from './fiches-connaissance/fiches-connaissance.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MaterielsModule } from './materiels/materiels.module';
import { PlansMaintenanceModule } from './plans-maintenance/plans-maintenance.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ClientsModule,
    SitesModule,
    ContactsModule,
    ContratsModule,
    ProjetsModule,
    EquipementsModule,
    ApplicationsModule,
    TypeFichesModule,
    ChampsPersonnalisesModule,
    InterventionsModule,
    PiecesJointesModule,
    SignaturesModule,
    RolesModule,
    IncidentsModule,
    FichesConnaissanceModule,
    NotificationsModule,
    MaterielsModule,
    PlansMaintenanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
