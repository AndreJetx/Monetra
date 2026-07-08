import { describe, expect, it, vi } from "vitest";
import { CreateExpenseUseCase } from "@/features/financial/application/use-cases/CreateExpenseUseCase";
import { Supplier } from "@/features/crm/domain/entities/Supplier";
import { SupplierArchivedError } from "@/features/crm/domain/errors/SupplierArchivedError";
import { SupplierNotFoundError } from "@/features/crm/domain/errors/SupplierNotFoundError";
import type { ISupplierRepository } from "@/features/crm/domain/repositories/ISupplierRepository";
import { Category } from "@/features/financial/domain/entities/Category";
import { InvalidExpenseAmountError } from "@/features/financial/domain/errors/InvalidExpenseAmountError";
import { ExpenseCategoryNotFoundError } from "@/features/financial/domain/errors/ExpenseCategoryNotFoundError";
import { ExpenseCategoryTypeMismatchError } from "@/features/financial/domain/errors/ExpenseCategoryTypeMismatchError";
import type { ICategoryRepository } from "@/features/financial/domain/repositories/ICategoryRepository";
import type { IExpenseRepository } from "@/features/financial/domain/repositories/IExpenseRepository";
import { CategoryType } from "@/features/financial/shared/types/CategoryType";
import { InsufficientPermissionError } from "@/features/identity/domain/errors/InsufficientPermissionError";
import { Role } from "@/features/identity/shared/types/Role";

const authContext = {
  userId: "user-1",
  organizationId: "org-1",
  role: Role.MEMBER,
};

function createSupplierRepositoryMock(
  overrides: Partial<ISupplierRepository> = {},
): ISupplierRepository {
  return {
    save: vi.fn(),
    findById: vi.fn().mockResolvedValue(null),
    findByName: vi.fn(),
    listByOrganization: vi.fn(),
    ...overrides,
  };
}

describe("CreateExpenseUseCase", () => {
  it("cria despesa com status inicial PENDING", async () => {
    const category = Category.create({
      id: "cat-1",
      organizationId: "org-1",
      name: "Aluguel",
      type: CategoryType.EXPENSE,
    });

    const expenseRepository: IExpenseRepository = {
      save: vi.fn().mockImplementation(async (expense) => expense),
      findById: vi.fn(),
      update: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn(),
    };

    const categoryRepository: ICategoryRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(category),
      findByName: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn(),
      isInUse: vi.fn(),
      createMany: vi.fn(),
    };

    const useCase = new CreateExpenseUseCase(
      expenseRepository,
      categoryRepository,
      createSupplierRepositoryMock(),
    );

    const result = await useCase.execute(
      {
        amount: 500,
        categoryId: "cat-1",
        dueDate: new Date("2026-07-15"),
        description: "Aluguel do escritorio",
      },
      authContext,
    );

    expect(result.toPrimitives().status).toBe("PENDING");
    expect(expenseRepository.save).toHaveBeenCalled();
  });

  it("falha quando categoria nao existe", async () => {
    const expenseRepository: IExpenseRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn(),
    };

    const categoryRepository: ICategoryRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(null),
      findByName: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn(),
      isInUse: vi.fn(),
      createMany: vi.fn(),
    };

    const useCase = new CreateExpenseUseCase(
      expenseRepository,
      categoryRepository,
      createSupplierRepositoryMock(),
    );

    await expect(
      useCase.execute(
        {
          amount: 500,
          categoryId: "missing",
          dueDate: new Date("2026-07-15"),
        },
        authContext,
      ),
    ).rejects.toThrow(ExpenseCategoryNotFoundError);
  });

  it("falha quando categoria nao e de despesa", async () => {
    const revenueCategory = Category.create({
      id: "cat-2",
      organizationId: "org-1",
      name: "Vendas",
      type: CategoryType.REVENUE,
    });

    const expenseRepository: IExpenseRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn(),
    };

    const categoryRepository: ICategoryRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(revenueCategory),
      findByName: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn(),
      isInUse: vi.fn(),
      createMany: vi.fn(),
    };

    const useCase = new CreateExpenseUseCase(
      expenseRepository,
      categoryRepository,
      createSupplierRepositoryMock(),
    );

    await expect(
      useCase.execute(
        {
          amount: 500,
          categoryId: "cat-2",
          dueDate: new Date("2026-07-15"),
        },
        authContext,
      ),
    ).rejects.toThrow(ExpenseCategoryTypeMismatchError);
  });

  it("falha com valor invalido", async () => {
    const category = Category.create({
      id: "cat-1",
      organizationId: "org-1",
      name: "Aluguel",
      type: CategoryType.EXPENSE,
    });

    const expenseRepository: IExpenseRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn(),
    };

    const categoryRepository: ICategoryRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(category),
      findByName: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn(),
      isInUse: vi.fn(),
      createMany: vi.fn(),
    };

    const useCase = new CreateExpenseUseCase(
      expenseRepository,
      categoryRepository,
      createSupplierRepositoryMock(),
    );

    await expect(
      useCase.execute(
        {
          amount: 0,
          categoryId: "cat-1",
          dueDate: new Date("2026-07-15"),
        },
        authContext,
      ),
    ).rejects.toThrow(InvalidExpenseAmountError);
  });

  it("nega criacao para VIEWER", async () => {
    const category = Category.create({
      id: "cat-1",
      organizationId: "org-1",
      name: "Aluguel",
      type: CategoryType.EXPENSE,
    });

    const expenseRepository: IExpenseRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn(),
    };

    const categoryRepository: ICategoryRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(category),
      findByName: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn(),
      isInUse: vi.fn(),
      createMany: vi.fn(),
    };

    const useCase = new CreateExpenseUseCase(
      expenseRepository,
      categoryRepository,
      createSupplierRepositoryMock(),
    );

    await expect(
      useCase.execute(
        {
          amount: 500,
          categoryId: "cat-1",
          dueDate: new Date("2026-07-15"),
        },
        { ...authContext, role: Role.VIEWER },
      ),
    ).rejects.toThrow(InsufficientPermissionError);
  });

  it("falha quando fornecedor informado nao existe", async () => {
    const category = Category.create({
      id: "cat-1",
      organizationId: "org-1",
      name: "Aluguel",
      type: CategoryType.EXPENSE,
    });

    const expenseRepository: IExpenseRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn(),
    };

    const categoryRepository: ICategoryRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(category),
      findByName: vi.fn(),
      listByOrganization: vi.fn(),
      isInUse: vi.fn(),
      createMany: vi.fn(),
    };

    const useCase = new CreateExpenseUseCase(
      expenseRepository,
      categoryRepository,
      createSupplierRepositoryMock({
        findById: vi.fn().mockResolvedValue(null),
      }),
    );

    await expect(
      useCase.execute(
        {
          amount: 500,
          categoryId: "cat-1",
          dueDate: new Date("2026-07-15"),
          supplierId: "missing",
        },
        authContext,
      ),
    ).rejects.toThrow(SupplierNotFoundError);
  });

  it("falha quando fornecedor informado esta arquivado", async () => {
    const category = Category.create({
      id: "cat-1",
      organizationId: "org-1",
      name: "Aluguel",
      type: CategoryType.EXPENSE,
    });

    const archivedSupplier = Supplier.create({
      id: "sup-1",
      organizationId: "org-1",
      name: "Fornecedor XPTO",
      archivedAt: new Date("2026-01-01"),
    });

    const expenseRepository: IExpenseRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn(),
    };

    const categoryRepository: ICategoryRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(category),
      findByName: vi.fn(),
      listByOrganization: vi.fn(),
      isInUse: vi.fn(),
      createMany: vi.fn(),
    };

    const useCase = new CreateExpenseUseCase(
      expenseRepository,
      categoryRepository,
      createSupplierRepositoryMock({
        findById: vi.fn().mockResolvedValue(archivedSupplier),
      }),
    );

    await expect(
      useCase.execute(
        {
          amount: 500,
          categoryId: "cat-1",
          dueDate: new Date("2026-07-15"),
          supplierId: "sup-1",
        },
        authContext,
      ),
    ).rejects.toThrow(SupplierArchivedError);
  });
});
