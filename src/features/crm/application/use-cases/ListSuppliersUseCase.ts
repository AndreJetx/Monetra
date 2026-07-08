import type { ISupplierRepository } from "@/features/crm/domain/repositories/ISupplierRepository";
import type { AuthContext } from "@/features/identity/application/authorize";
import { authorizeOrThrow } from "@/features/identity/application/authorize";

export class ListSuppliersUseCase {
  constructor(private readonly supplierRepository: ISupplierRepository) {}

  async execute(authContext: AuthContext) {
    authorizeOrThrow(authContext.role, "supplier:view");
    return this.supplierRepository.listByOrganization(authContext.organizationId);
  }
}
