import { describe, expect, it, vi } from "vitest";
import { CreateRevenueUseCase } from "@/features/financial/application/use-cases/CreateRevenueUseCase";
import { Category } from "@/features/financial/domain/entities/Category";
import { InvalidRevenueAmountError } from "@/features/financial/domain/errors/InvalidRevenueAmountError";
import { RevenueCategoryNotFoundError } from "@/features/financial/domain/errors/RevenueCategoryNotFoundError";
import { RevenueCategoryTypeMismatchError } from "@/features/financial/domain/errors/RevenueCategoryTypeMismatchError";
import type { ICategoryRepository } from "@/features/financial/domain/repositories/ICategoryRepository";
import type { IRevenueRepository } from "@/features/financial/domain/repositories/IRevenueRepository";
import { CategoryType } from "@/features/financial/shared/types/CategoryType";
import { InsufficientPermissionError } from "@/features/identity/domain/errors/InsufficientPermissionError";
import { Role } from "@/features/identity/shared/types/Role";

const authContext = {
  userId: "user-1",
  organizationId: "org-1",
  role: Role.MEMBER,
};

describe("CreateRevenueUseCase", () => {
  it("cria receita com status inicial PENDING", async () => {
    const category = Category.create({
      id: "cat-1",
      organizationId: "org-1",
      name: "Vendas",
      type: CategoryType.REVENUE,
    });

    const revenueRepository: IRevenueRepository = {
      save: vi.fn().mockImplementation(async (revenue) => revenue),
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

    const useCase = new CreateRevenueUseCase(revenueRepository, categoryRepository);

    const result = await useCase.execute(
      {
        amount: 1000,
        categoryId: "cat-1",
        dueDate: new Date("2026-07-09"),
        description: "Venda de servico",
      },
      authContext,
    );

    expect(result.toPrimitives().status).toBe("PENDING");
    expect(revenueRepository.save).toHaveBeenCalled();
  });

  it("falha quando categoria nao existe", async () => {
    const revenueRepository: IRevenueRepository = {
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

    const useCase = new CreateRevenueUseCase(revenueRepository, categoryRepository);

    await expect(
      useCase.execute(
        {
          amount: 500,
          categoryId: "missing",
          dueDate: new Date("2026-07-09"),
        },
        authContext,
      ),
    ).rejects.toThrow(RevenueCategoryNotFoundError);
  });

  it("falha quando categoria nao e de receita", async () => {
    const expenseCategory = Category.create({
      id: "cat-2",
      organizationId: "org-1",
      name: "Aluguel",
      type: CategoryType.EXPENSE,
    });

    const revenueRepository: IRevenueRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      listByOrganization: vi.fn(),
    };

    const categoryRepository: ICategoryRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(expenseCategory),
      findByName: vi.fn(),
      listByOrganization: vi.fn(),
      isInUse: vi.fn(),
      createMany: vi.fn(),
    };

    const useCase = new CreateRevenueUseCase(revenueRepository, categoryRepository);

    await expect(
      useCase.execute(
        {
          amount: 500,
          categoryId: "cat-2",
          dueDate: new Date("2026-07-09"),
        },
        authContext,
      ),
    ).rejects.toThrow(RevenueCategoryTypeMismatchError);
  });

  it("falha com valor invalido", async () => {
    const category = Category.create({
      id: "cat-1",
      organizationId: "org-1",
      name: "Vendas",
      type: CategoryType.REVENUE,
    });

    const revenueRepository: IRevenueRepository = {
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

    const useCase = new CreateRevenueUseCase(revenueRepository, categoryRepository);

    await expect(
      useCase.execute(
        {
          amount: 0,
          categoryId: "cat-1",
          dueDate: new Date("2026-07-09"),
        },
        authContext,
      ),
    ).rejects.toThrow(InvalidRevenueAmountError);
  });

  it("nega criacao para VIEWER", async () => {
    const category = Category.create({
      id: "cat-1",
      organizationId: "org-1",
      name: "Vendas",
      type: CategoryType.REVENUE,
    });

    const revenueRepository: IRevenueRepository = {
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

    const useCase = new CreateRevenueUseCase(revenueRepository, categoryRepository);

    await expect(
      useCase.execute(
        {
          amount: 500,
          categoryId: "cat-1",
          dueDate: new Date("2026-07-09"),
        },
        { ...authContext, role: Role.VIEWER },
      ),
    ).rejects.toThrow(InsufficientPermissionError);
  });
});
