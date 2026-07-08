import type { Supplier } from "@/features/crm/domain/entities/Supplier";

export interface ISupplierRepository {
  save(supplier: Supplier): Promise<Supplier>;
  findById(id: string, organizationId: string): Promise<Supplier | null>;
  findByName(name: string, organizationId: string): Promise<Supplier | null>;
  listByOrganization(organizationId: string): Promise<Supplier[]>;
}
