import { prisma } from "@/shared/db/prisma";
import { CreateCustomerUseCase } from "@/features/crm/application/use-cases/CreateCustomerUseCase";
import { ListCustomersUseCase } from "@/features/crm/application/use-cases/ListCustomersUseCase";
import { PrismaCustomerRepository } from "@/features/crm/infrastructure/repositories/PrismaCustomerRepository";

export function createCreateCustomerUseCase(): CreateCustomerUseCase {
  return new CreateCustomerUseCase(new PrismaCustomerRepository(prisma));
}

export function createListCustomersUseCase(): ListCustomersUseCase {
  return new ListCustomersUseCase(new PrismaCustomerRepository(prisma));
}

export function createCustomerRepository(): PrismaCustomerRepository {
  return new PrismaCustomerRepository(prisma);
}
