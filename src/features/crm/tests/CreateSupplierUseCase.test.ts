import { describe, expect, it, vi } from "vitest";
import { CreateSupplierUseCase } from "@/features/crm/application/use-cases/CreateSupplierUseCase";
import { SupplierNameAlreadyExistsError } from "@/features/crm/domain/errors/SupplierNameAlreadyExistsError";
import { Supplier } from "@/features/crm/domain/entities/Supplier";
import type { ISupplierRepository } from "@/features/crm/domain/repositories/ISupplierRepository";
import { InsufficientPermissionError } from "@/features/identity/domain/errors/InsufficientPermissionError";
import { Role } from "@/features/identity/shared/types/Role";

const authContext = {
  userId: "user-1",
  organizationId: "org-1",
  role: Role.MEMBER,
};

describe("CreateSupplierUseCase", () => {
  it("cria fornecedor com campos obrigatorios e opcionais", async () => {
    const repository: ISupplierRepository = {
      save: vi.fn().mockImplementation(async (supplier) => supplier),
      findById: vi.fn(),
      findByName: vi.fn().mockResolvedValue(null),
      listByOrganization: vi.fn(),
    };

    const useCase = new CreateSupplierUseCase(repository);
    const supplier = await useCase.execute(
      {
        name: "Fornecedor XPTO",
        email: "contato@xpto.com",
        phone: "11999999999",
        document: "12345678000199",
      },
      authContext,
    );

    expect(supplier.toPrimitives().name).toBe("Fornecedor XPTO");
    expect(repository.save).toHaveBeenCalled();
  });

  it("rejeita nome duplicado case-insensitive", async () => {
    const existing = Supplier.create({
      id: "sup-1",
      organizationId: "org-1",
      name: "Fornecedor XPTO",
    });

    const repository: ISupplierRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn().mockResolvedValue(existing),
      listByOrganization: vi.fn(),
    };

    const useCase = new CreateSupplierUseCase(repository);

    await expect(useCase.execute({ name: "fornecedor xpto" }, authContext)).rejects.toThrow(
      SupplierNameAlreadyExistsError,
    );
  });

  it("nega criacao para VIEWER", async () => {
    const repository: ISupplierRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn().mockResolvedValue(null),
      listByOrganization: vi.fn(),
    };

    const useCase = new CreateSupplierUseCase(repository);

    await expect(
      useCase.execute({ name: "Fornecedor XPTO" }, { ...authContext, role: Role.VIEWER }),
    ).rejects.toThrow(InsufficientPermissionError);
  });
});
