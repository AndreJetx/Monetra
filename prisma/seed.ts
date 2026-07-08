import { CategoryType, PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const defaultCategories = [
  { name: "Vendas", type: CategoryType.REVENUE },
  { name: "Serviços", type: CategoryType.REVENUE },
  { name: "Outras receitas", type: CategoryType.REVENUE },
  { name: "Salários", type: CategoryType.EXPENSE },
  { name: "Aluguel", type: CategoryType.EXPENSE },
  { name: "Fornecedores", type: CategoryType.EXPENSE },
  { name: "Impostos", type: CategoryType.EXPENSE },
  { name: "Outras despesas", type: CategoryType.EXPENSE },
];

async function main() {
  const passwordHash = await bcrypt.hash("Monetra@123", 12);

  const ownerUser = await prisma.user.upsert({
    where: { email: "owner@monetra.dev" },
    update: {},
    create: {
      name: "André Flor",
      email: "owner@monetra.dev",
      passwordHash,
      emailVerified: new Date(),
    },
  });

  const viewerUser = await prisma.user.upsert({
    where: { email: "viewer@monetra.dev" },
    update: {},
    create: {
      name: "Viewer Monetra",
      email: "viewer@monetra.dev",
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
        userId: ownerUser.id,
        organizationId: organization.id,
      },
    },
    update: {},
    create: {
      userId: ownerUser.id,
      organizationId: organization.id,
      role: Role.OWNER,
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: viewerUser.id,
        organizationId: organization.id,
      },
    },
    update: {},
    create: {
      userId: viewerUser.id,
      organizationId: organization.id,
      role: Role.VIEWER,
    },
  });

  await prisma.category.createMany({
    data: defaultCategories.map((category) => ({
      organizationId: organization.id,
      name: category.name,
      type: category.type,
      isDefault: true,
    })),
    skipDuplicates: true,
  });

  console.log("Seed concluído:");
  console.log(`  Owner:  ${ownerUser.email}`);
  console.log(`  Viewer: ${viewerUser.email}`);
  console.log(`  Org:    ${organization.name}`);
  console.log(`  Categorias padrão: ${defaultCategories.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
