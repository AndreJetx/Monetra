import { Supplier } from "@/features/crm/domain/entities/Supplier";
import { SupplierNameAlreadyExistsError } from "@/features/crm/domain/errors/SupplierNameAlreadyExistsError";
import type { ISupplierRepository } from "@/features/crm/domain/repositories/ISupplierRepository";
import type { AuthContext } from "@/features/identity/application/authorize";
import { authorizeOrThrow } from "@/features/identity/application/authorize";

type CreateSupplierInput = {
  name: string;
  email?: string;
  phone?: string;
  document?: string;
};

export class CreateSupplierUseCase {
  constructor(private readonly supplierRepository: ISupplierRepository) {}

  async execute(input: CreateSupplierInput, authContext: AuthContext): Promise<Supplier> {
    authorizeOrThrow(authContext.role, "supplier:create");

    const existing = await this.supplierRepository.findByName(
      input.name,
      authContext.organizationId,
    );

    if (existing) {
      throw new SupplierNameAlreadyExistsError();
    }

    const supplier = Supplier.create({
      organizationId: authContext.organizationId,
      name: input.name,
      email: input.email,
      phone: input.phone,
      document: input.document,
    });

    return this.supplierRepository.save(supplier);
  }
}
