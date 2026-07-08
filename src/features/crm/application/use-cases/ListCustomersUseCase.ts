import type { ICustomerRepository } from "@/features/crm/domain/repositories/ICustomerRepository";
import type { AuthContext } from "@/features/identity/application/authorize";
import { authorizeOrThrow } from "@/features/identity/application/authorize";

export class ListCustomersUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(authContext: AuthContext) {
    authorizeOrThrow(authContext.role, "customer:view");
    return this.customerRepository.listByOrganization(authContext.organizationId);
  }
}
