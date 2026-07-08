import { describe, expect, it, vi } from "vitest";
import { ListSuppliersUseCase } from "@/features/crm/application/use-cases/ListSuppliersUseCase";
import { Supplier } from "@/features/crm/domain/entities/Supplier";
import type { ISupplierRepository } from "@/features/crm/domain/repositories/ISupplierRepository";
import { Role } from "@/features/identity/shared/types/Role";

const authContext = {
  userId: "user-1",
  organizationId: "org-1",
  role: Role.MEMBER,
};

describe("ListSuppliersUseCase", () => {
  it("lista fornecedores ativos da organizacao", async () => {
    const activeSupplier = Supplier.create({
      id: "sup-1",
      organizationId: "org-1",
      name: "Fornecedor XPTO",
    });

    const repository: ISupplierRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn(),
      listByOrganization: vi.fn().mockResolvedValue([activeSupplier]),
    };

    const useCase = new ListSuppliersUseCase(repository);
    const suppliers = await useCase.execute(authContext);

    expect(suppliers).toHaveLength(1);
    expect(repository.listByOrganization).toHaveBeenCalledWith("org-1");
  });

  it("permite acesso para VIEWER com supplier:view", async () => {
    const repository: ISupplierRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn(),
      listByOrganization: vi.fn().mockResolvedValue([]),
    };

    const useCase = new ListSuppliersUseCase(repository);

    await expect(useCase.execute({ ...authContext, role: Role.VIEWER })).resolves.toEqual([]);
  });
});
