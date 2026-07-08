import { prisma } from "@/shared/db/prisma";
import { PrismaCategoryRepository } from "@/features/financial/infrastructure/repositories/PrismaCategoryRepository";
import { CreateCategoryUseCase } from "@/features/financial/application/use-cases/CreateCategoryUseCase";
import { ListCategoriesUseCase } from "@/features/financial/application/use-cases/ListCategoriesUseCase";
import { UpdateCategoryUseCase } from "@/features/financial/application/use-cases/UpdateCategoryUseCase";
import { ArchiveCategoryUseCase } from "@/features/financial/application/use-cases/ArchiveCategoryUseCase";
import { ProvisionDefaultCategoriesUseCase } from "@/features/financial/application/use-cases/ProvisionDefaultCategoriesUseCase";
import { DefaultCategoriesProvisioner } from "@/features/financial/infrastructure/bootstrap/DefaultCategoriesProvisioner";
import { PrismaRevenueRepository } from "@/features/financial/infrastructure/repositories/PrismaRevenueRepository";
import { CreateRevenueUseCase } from "@/features/financial/application/use-cases/CreateRevenueUseCase";
import { ListRevenuesUseCase } from "@/features/financial/application/use-cases/ListRevenuesUseCase";
import { ConfirmRevenueReceiptUseCase } from "@/features/financial/application/use-cases/ConfirmRevenueReceiptUseCase";
import { PrismaExpenseRepository } from "@/features/financial/infrastructure/repositories/PrismaExpenseRepository";
import { CreateExpenseUseCase } from "@/features/financial/application/use-cases/CreateExpenseUseCase";
import { ListExpensesUseCase } from "@/features/financial/application/use-cases/ListExpensesUseCase";
import { ConfirmExpensePaymentUseCase } from "@/features/financial/application/use-cases/ConfirmExpensePaymentUseCase";
import { GetCashFlowUseCase } from "@/features/financial/application/use-cases/GetCashFlowUseCase";
import { createCustomerRepository } from "@/features/crm/infrastructure/factories";

export function createCreateCategoryUseCase(): CreateCategoryUseCase {
  return new CreateCategoryUseCase(new PrismaCategoryRepository(prisma));
}

export function createListCategoriesUseCase(): ListCategoriesUseCase {
  return new ListCategoriesUseCase(new PrismaCategoryRepository(prisma));
}

export function createUpdateCategoryUseCase(): UpdateCategoryUseCase {
  return new UpdateCategoryUseCase(new PrismaCategoryRepository(prisma));
}

export function createArchiveCategoryUseCase(): ArchiveCategoryUseCase {
  return new ArchiveCategoryUseCase(new PrismaCategoryRepository(prisma));
}

export function createProvisionDefaultCategoriesUseCase(): ProvisionDefaultCategoriesUseCase {
  return new ProvisionDefaultCategoriesUseCase(new PrismaCategoryRepository(prisma));
}

export function createDefaultCategoriesProvisioner(): DefaultCategoriesProvisioner {
  return new DefaultCategoriesProvisioner(createProvisionDefaultCategoriesUseCase());
}

export function createCreateRevenueUseCase(): CreateRevenueUseCase {
  return new CreateRevenueUseCase(
    new PrismaRevenueRepository(prisma),
    new PrismaCategoryRepository(prisma),
    createCustomerRepository(),
  );
}

export function createListRevenuesUseCase(): ListRevenuesUseCase {
  return new ListRevenuesUseCase(new PrismaRevenueRepository(prisma));
}

export function createConfirmRevenueReceiptUseCase(): ConfirmRevenueReceiptUseCase {
  return new ConfirmRevenueReceiptUseCase(new PrismaRevenueRepository(prisma));
}

export function createCreateExpenseUseCase(): CreateExpenseUseCase {
  return new CreateExpenseUseCase(
    new PrismaExpenseRepository(prisma),
    new PrismaCategoryRepository(prisma),
  );
}

export function createListExpensesUseCase(): ListExpensesUseCase {
  return new ListExpensesUseCase(new PrismaExpenseRepository(prisma));
}

export function createConfirmExpensePaymentUseCase(): ConfirmExpensePaymentUseCase {
  return new ConfirmExpensePaymentUseCase(new PrismaExpenseRepository(prisma));
}

export function createGetCashFlowUseCase(): GetCashFlowUseCase {
  return new GetCashFlowUseCase(
    new PrismaRevenueRepository(prisma),
    new PrismaExpenseRepository(prisma),
  );
}
