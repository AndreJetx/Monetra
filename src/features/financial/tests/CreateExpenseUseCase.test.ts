import { describe, expect, it, vi } from "vitest";
import { CreateExpenseUseCase } from "@/features/financial/application/use-cases/CreateExpenseUseCase";
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
    };

    const categoryRepository: ICategoryRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(category),
      findByName: vi.fn(),
      listByOrganization: vi.fn(),
      isInUse: vi.fn(),
      createMany: vi.fn(),
    };

    const useCase = new CreateExpenseUseCase(expenseRepository, categoryRepository);

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
    };

    const categoryRepository: ICategoryRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(null),
      findByName: vi.fn(),
      listByOrganization: vi.fn(),
      isInUse: vi.fn(),
      createMany: vi.fn(),
    };

    const useCase = new CreateExpenseUseCase(expenseRepository, categoryRepository);

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
    };

    const categoryRepository: ICategoryRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(revenueCategory),
      findByName: vi.fn(),
      listByOrganization: vi.fn(),
      isInUse: vi.fn(),
      createMany: vi.fn(),
    };

    const useCase = new CreateExpenseUseCase(expenseRepository, categoryRepository);

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
    };

    const categoryRepository: ICategoryRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(category),
      findByName: vi.fn(),
      listByOrganization: vi.fn(),
      isInUse: vi.fn(),
      createMany: vi.fn(),
    };

    const useCase = new CreateExpenseUseCase(expenseRepository, categoryRepository);

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
    };

    const categoryRepository: ICategoryRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(category),
      findByName: vi.fn(),
      listByOrganization: vi.fn(),
      isInUse: vi.fn(),
      createMany: vi.fn(),
    };

    const useCase = new CreateExpenseUseCase(expenseRepository, categoryRepository);

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
});
