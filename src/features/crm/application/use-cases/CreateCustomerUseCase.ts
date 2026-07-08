import { Customer } from "@/features/crm/domain/entities/Customer";
import { CustomerNameAlreadyExistsError } from "@/features/crm/domain/errors/CustomerNameAlreadyExistsError";
import type { ICustomerRepository } from "@/features/crm/domain/repositories/ICustomerRepository";
import type { AuthContext } from "@/features/identity/application/authorize";
import { authorizeOrThrow } from "@/features/identity/application/authorize";

type CreateCustomerInput = {
  name: string;
  email?: string;
  phone?: string;
  document?: string;
};

export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(input: CreateCustomerInput, authContext: AuthContext): Promise<Customer> {
    authorizeOrThrow(authContext.role, "customer:create");

    const existing = await this.customerRepository.findByName(
      input.name,
      authContext.organizationId,
    );

    if (existing) {
      throw new CustomerNameAlreadyExistsError();
    }

    const customer = Customer.create({
      organizationId: authContext.organizationId,
      name: input.name,
      email: input.email,
      phone: input.phone,
      document: input.document,
    });

    return this.customerRepository.save(customer);
  }
}
