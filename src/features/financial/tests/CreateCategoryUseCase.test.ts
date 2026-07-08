import { describe, expect, it, vi } from "vitest";
import { CreateCategoryUseCase } from "@/features/financial/application/use-cases/CreateCategoryUseCase";
import { CategoryNameAlreadyExistsError } from "@/features/financial/domain/errors/CategoryNameAlreadyExistsError";
import type { ICategoryRepository } from "@/features/financial/domain/repositories/ICategoryRepository";
import { CategoryType } from "@/features/financial/shared/types/CategoryType";
import { Role } from "@/features/identity/shared/types/Role";
import { InsufficientPermissionError } from "@/features/identity/domain/errors/InsufficientPermissionError";

const authContext = {
  userId: "user-1",
  organizationId: "org-1",
  role: Role.ADMIN,
};

describe("CreateCategoryUseCase", () => {
  it("cria categoria quando dados s�o v�lidos", async () => {
    const repository: ICategoryRepository = {
      save: vi.fn().mockImplementation(async (category) => category),
      findById: vi.fn(),
      findByName: vi.fn().mockResolvedValue(null),
      listByOrganization: vi.fn(),
      isInUse: vi.fn(),
      createMany: vi.fn(),
    };

    const useCase = new CreateCategoryUseCase(repository);
    const category = await useCase.execute(
      { name: "Marketing", type: CategoryType.EXPENSE },
      authContext,
    );

    expect(category.getName()).toBe("Marketing");
    expect(repository.save).toHaveBeenCalled();
  });

  it("falha quando j� existe categoria com mesmo nome e tipo", async () => {
    const duplicate = {
      getId: () => "cat-1",
      getType: () => CategoryType.EXPENSE,
    } as never;

    const repository: ICategoryRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn().mockResolvedValue(duplicate),
      listByOrganization: vi.fn(),
      isInUse: vi.fn(),
      createMany: vi.fn(),
    };

    const useCase = new CreateCategoryUseCase(repository);

    await expect(
      useCase.execute({ name: "Marketing", type: CategoryType.EXPENSE }, authContext),
    ).rejects.toThrow(CategoryNameAlreadyExistsError);
  });

  it("nega cria��o para VIEWER", async () => {
    const repository: ICategoryRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn().mockResolvedValue(null),
      listByOrganization: vi.fn(),
      isInUse: vi.fn(),
      createMany: vi.fn(),
    };

    const useCase = new CreateCategoryUseCase(repository);

    await expect(
      useCase.execute(
        { name: "Marketing", type: CategoryType.EXPENSE },
        { ...authContext, role: Role.VIEWER },
      ),
    ).rejects.toThrow(InsufficientPermissionError);
  });
});
