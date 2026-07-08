import type { Customer } from "@/features/crm/domain/entities/Customer";

export interface ICustomerRepository {
  save(customer: Customer): Promise<Customer>;
  findById(id: string, organizationId: string): Promise<Customer | null>;
  findByName(name: string, organizationId: string): Promise<Customer | null>;
  listByOrganization(organizationId: string): Promise<Customer[]>;
}
