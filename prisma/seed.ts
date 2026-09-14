import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ROLES } from '../src/common/constants/roles.constant';
import { isLocalDatabase } from '../src/common/utils/is-local-database';

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({
  connectionString,
  ssl: isLocalDatabase(connectionString) ? undefined : { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const libelle of Object.values(ROLES)) {
    await prisma.role.upsert({
      where: { libelle },
      update: {},
      create: { libelle },
    });
  }

  const adminRole = await prisma.role.findUniqueOrThrow({
    where: { libelle: ROLES.ADMINISTRATEUR },
  });

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@sahelys.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';

  const admin = await prisma.utilisateur.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      nom: 'Admin',
      prenom: 'Sahelys',
      email: adminEmail,
      motDePasse: await bcrypt.hash(adminPassword, 10),
      roleId: adminRole.id,
    },
  });

  console.log('Rôles initialisés :', Object.values(ROLES).join(', '));
  console.log(
    `Administrateur de bootstrap : ${admin.email} (mot de passe : ${
      process.env.SEED_ADMIN_PASSWORD ? '<défini via SEED_ADMIN_PASSWORD>' : adminPassword
    } — à changer immédiatement)`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
