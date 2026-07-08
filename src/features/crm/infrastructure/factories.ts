import { prisma } from "@/shared/db/prisma";
import { CreateCustomerUseCase } from "@/features/crm/application/use-cases/CreateCustomerUseCase";
import { ListCustomersUseCase } from "@/features/crm/application/use-cases/ListCustomersUseCase";
import { CreateSupplierUseCase } from "@/features/crm/application/use-cases/CreateSupplierUseCase";
import { ListSuppliersUseCase } from "@/features/crm/application/use-cases/ListSuppliersUseCase";
import { PrismaCustomerRepository } from "@/features/crm/infrastructure/repositories/PrismaCustomerRepository";
import { PrismaSupplierRepository } from "@/features/crm/infrastructure/repositories/PrismaSupplierRepository";

export function createCreateCustomerUseCase(): CreateCustomerUseCase {
  return new CreateCustomerUseCase(new PrismaCustomerRepository(prisma));
}

export function createListCustomersUseCase(): ListCustomersUseCase {
  return new ListCustomersUseCase(new PrismaCustomerRepository(prisma));
}

export function createCustomerRepository(): PrismaCustomerRepository {
  return new PrismaCustomerRepository(prisma);
}

export function createCreateSupplierUseCase(): CreateSupplierUseCase {
  return new CreateSupplierUseCase(new PrismaSupplierRepository(prisma));
}

export function createListSuppliersUseCase(): ListSuppliersUseCase {
  return new ListSuppliersUseCase(new PrismaSupplierRepository(prisma));
}

export function createSupplierRepository(): PrismaSupplierRepository {
  return new PrismaSupplierRepository(prisma);
}
