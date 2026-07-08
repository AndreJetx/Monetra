import { describe, expect, it, vi } from "vitest";
import { ProvisionDefaultCategoriesUseCase } from "@/features/financial/application/use-cases/ProvisionDefaultCategoriesUseCase";
import type { ICategoryRepository } from "@/features/financial/domain/repositories/ICategoryRepository";

describe("ProvisionDefaultCategoriesUseCase", () => {
  it("provisiona categorias padr�o quando organiza��o n�o possui categorias", async () => {
    const repository: ICategoryRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn(),
      listByOrganization: vi.fn().mockResolvedValue([]),
      isInUse: vi.fn(),
      createMany: vi.fn(),
    };

    const useCase = new ProvisionDefaultCategoriesUseCase(repository);
    await useCase.execute("org-1");

    expect(repository.createMany).toHaveBeenCalled();
    expect(vi.mocked(repository.createMany).mock.calls[0][0]).toHaveLength(8);
  });

  it("n�o duplica categorias quando organiza��o j� possui cadastro", async () => {
    const repository: ICategoryRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn(),
      listByOrganization: vi.fn().mockResolvedValue([{}]),
      isInUse: vi.fn(),
      createMany: vi.fn(),
    };

    const useCase = new ProvisionDefaultCategoriesUseCase(repository);
    await useCase.execute("org-1");

    expect(repository.createMany).not.toHaveBeenCalled();
  });
});
