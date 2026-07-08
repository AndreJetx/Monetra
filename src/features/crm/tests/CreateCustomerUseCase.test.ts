import { describe, expect, it, vi } from "vitest";
import { CreateCustomerUseCase } from "@/features/crm/application/use-cases/CreateCustomerUseCase";
import { CustomerNameAlreadyExistsError } from "@/features/crm/domain/errors/CustomerNameAlreadyExistsError";
import { Customer } from "@/features/crm/domain/entities/Customer";
import type { ICustomerRepository } from "@/features/crm/domain/repositories/ICustomerRepository";
import { InsufficientPermissionError } from "@/features/identity/domain/errors/InsufficientPermissionError";
import { Role } from "@/features/identity/shared/types/Role";

const authContext = {
  userId: "user-1",
  organizationId: "org-1",
  role: Role.MEMBER,
};

describe("CreateCustomerUseCase", () => {
  it("cria cliente com campos obrigatorios e opcionais", async () => {
    const repository: ICustomerRepository = {
      save: vi.fn().mockImplementation(async (customer) => customer),
      findById: vi.fn(),
      findByName: vi.fn().mockResolvedValue(null),
      listByOrganization: vi.fn(),
    };

    const useCase = new CreateCustomerUseCase(repository);
    const customer = await useCase.execute(
      {
        name: "Acme Corp",
        email: "contato@acme.com",
        phone: "11999999999",
        document: "12345678900",
      },
      authContext,
    );

    expect(customer.toPrimitives().name).toBe("Acme Corp");
    expect(repository.save).toHaveBeenCalled();
  });

  it("rejeita nome duplicado case-insensitive", async () => {
    const existing = Customer.create({
      id: "cust-1",
      organizationId: "org-1",
      name: "Acme Corp",
    });

    const repository: ICustomerRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn().mockResolvedValue(existing),
      listByOrganization: vi.fn(),
    };

    const useCase = new CreateCustomerUseCase(repository);

    await expect(useCase.execute({ name: "acme corp" }, authContext)).rejects.toThrow(
      CustomerNameAlreadyExistsError,
    );
  });

  it("nega criacao para VIEWER", async () => {
    const repository: ICustomerRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn().mockResolvedValue(null),
      listByOrganization: vi.fn(),
    };

    const useCase = new CreateCustomerUseCase(repository);

    await expect(
      useCase.execute({ name: "Acme Corp" }, { ...authContext, role: Role.VIEWER }),
    ).rejects.toThrow(InsufficientPermissionError);
  });
});
