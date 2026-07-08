import { describe, expect, it, vi } from "vitest";
import { ArchiveCategoryUseCase } from "@/features/financial/application/use-cases/ArchiveCategoryUseCase";
import { Category } from "@/features/financial/domain/entities/Category";
import { CategoryInUseError } from "@/features/financial/domain/errors/CategoryInUseError";
import type { ICategoryRepository } from "@/features/financial/domain/repositories/ICategoryRepository";
import { CategoryType } from "@/features/financial/shared/types/CategoryType";
import { Role } from "@/features/identity/shared/types/Role";
import { DefaultCategoryArchiveNotAllowedError } from "@/features/financial/domain/errors/DefaultCategoryArchiveNotAllowedError";

const authContext = {
  userId: "user-1",
  organizationId: "org-1",
  role: Role.ADMIN,
};

describe("ArchiveCategoryUseCase", () => {
  it("arquiva categoria fora de uso", async () => {
    const category = Category.create({
      id: "cat-1",
      organizationId: "org-1",
      name: "Marketing",
      type: CategoryType.EXPENSE,
    });

    const repository: ICategoryRepository = {
      save: vi.fn().mockResolvedValue(category),
      findById: vi.fn().mockResolvedValue(category),
      findByName: vi.fn(),
      listByOrganization: vi.fn(),
      isInUse: vi.fn().mockResolvedValue(false),
      createMany: vi.fn(),
    };

    const useCase = new ArchiveCategoryUseCase(repository);
    await useCase.execute({ id: "cat-1" }, authContext);

    expect(repository.save).toHaveBeenCalled();
  });

  it("falha quando categoria est� em uso", async () => {
    const category = Category.create({
      id: "cat-1",
      organizationId: "org-1",
      name: "Marketing",
      type: CategoryType.EXPENSE,
    });

    const repository: ICategoryRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(category),
      findByName: vi.fn(),
      listByOrganization: vi.fn(),
      isInUse: vi.fn().mockResolvedValue(true),
      createMany: vi.fn(),
    };

    const useCase = new ArchiveCategoryUseCase(repository);

    await expect(useCase.execute({ id: "cat-1" }, authContext)).rejects.toThrow(CategoryInUseError);
  });

  it("bloqueia arquivamento de categoria padr�o", async () => {
    const category = Category.create({
      id: "cat-1",
      organizationId: "org-1",
      name: "Vendas",
      type: CategoryType.REVENUE,
      isDefault: true,
    });

    const repository: ICategoryRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(category),
      findByName: vi.fn(),
      listByOrganization: vi.fn(),
      isInUse: vi.fn().mockResolvedValue(false),
      createMany: vi.fn(),
    };

    const useCase = new ArchiveCategoryUseCase(repository);

    await expect(useCase.execute({ id: "cat-1" }, authContext)).rejects.toThrow(
      DefaultCategoryArchiveNotAllowedError,
    );
  });
});
