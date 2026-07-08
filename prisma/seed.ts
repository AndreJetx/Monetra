import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Monetra@123", 12);

  const user = await prisma.user.upsert({
    where: { email: "owner@monetra.dev" },
    update: {},
    create: {
      name: "André Flor",
      email: "owner@monetra.dev",
      passwordHash,
      emailVerified: new Date(),
    },
  });

  const organization = await prisma.organization.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Monetra Demo",
      currency: "BRL",
      timezone: "America/Sao_Paulo",
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId: organization.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      organizationId: organization.id,
      role: Role.OWNER,
    },
  });

  console.log("Seed concluído:");
  console.log(`  User: ${user.email}`);
  console.log(`  Org:  ${organization.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
