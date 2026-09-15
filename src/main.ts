import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API SAHELYS')
    .setDescription(
      "API de la plateforme SAHELYS de dématérialisation et de gestion des fiches d'intervention",
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: "Jeton JWT obtenu via POST /api/auth/login",
      },
      'JWT-auth',
    )
    .addTag('Authentification', "Connexion et informations sur l'utilisateur connecté")
    .addTag('Utilisateurs', 'Gestion des comptes utilisateurs (réservé aux administrateurs)')
    .addTag('Clients', 'Référentiel des organisations clientes de SAHELYS')
    .addTag('Sites', 'Sites physiques des clients')
    .addTag('Contacts', 'Personnes référentes chez les clients')
    .addTag('Contrats', 'Contrats / SLA liant SAHELYS à ses clients')
    .addTag('Projets', "Projets d'implémentation ou de digitalisation menés chez un client")
    .addTag('Équipements', 'Équipements informatiques des clients')
    .addTag('Applications', 'Applications logicielles développées/maintenues pour un client')
    .addTag('Types de fiche', "Types de fiches d'intervention (moteur de formulaires dynamiques)")
    .addTag('Champs personnalisés', 'Champs dynamiques rattachés à un type de fiche')
    .addTag('Interventions', "Cœur métier : fiches d'intervention et leur cycle de vie")
    .addTag('Pièces jointes', 'Photos et documents joints à une intervention')
    .addTag('Signatures', 'Signatures électroniques (technicien et/ou client) sur une intervention')
    .addTag('Matériel & stock', "Pièces détachées/consommables et mouvements de stock (hors dossier technique d'origine)")
    .addTag('Plans de maintenance', "Plans de maintenance préventive récurrents (hors dossier technique d'origine)")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
