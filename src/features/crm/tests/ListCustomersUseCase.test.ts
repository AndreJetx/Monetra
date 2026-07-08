import { describe, expect, it, vi } from "vitest";
import { ListCustomersUseCase } from "@/features/crm/application/use-cases/ListCustomersUseCase";
import { Customer } from "@/features/crm/domain/entities/Customer";
import type { ICustomerRepository } from "@/features/crm/domain/repositories/ICustomerRepository";
import { Role } from "@/features/identity/shared/types/Role";

const authContext = {
  userId: "user-1",
  organizationId: "org-1",
  role: Role.MEMBER,
};

describe("ListCustomersUseCase", () => {
  it("lista clientes ativos da organizacao", async () => {
    const activeCustomer = Customer.create({
      id: "cust-1",
      organizationId: "org-1",
      name: "Acme Corp",
    });

    const repository: ICustomerRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn(),
      listByOrganization: vi.fn().mockResolvedValue([activeCustomer]),
    };

    const useCase = new ListCustomersUseCase(repository);
    const customers = await useCase.execute(authContext);

    expect(customers).toHaveLength(1);
    expect(repository.listByOrganization).toHaveBeenCalledWith("org-1");
  });

  it("permite acesso para VIEWER com customer:view", async () => {
    const repository: ICustomerRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn(),
      listByOrganization: vi.fn().mockResolvedValue([]),
    };

    const useCase = new ListCustomersUseCase(repository);

    await expect(useCase.execute({ ...authContext, role: Role.VIEWER })).resolves.toEqual([]);
  });
});
