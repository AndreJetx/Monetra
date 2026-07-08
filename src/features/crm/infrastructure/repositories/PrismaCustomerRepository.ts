import type { PrismaClient } from "@prisma/client";
import type { Customer } from "@/features/crm/domain/entities/Customer";
import type { ICustomerRepository } from "@/features/crm/domain/repositories/ICustomerRepository";
import { CustomerMapper } from "@/features/crm/infrastructure/mappers/CustomerMapper";

export class PrismaCustomerRepository implements ICustomerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(customer: Customer): Promise<Customer> {
    const data = customer.toPrimitives();

    const saved = await this.prisma.customer.create({
      data: {
        organizationId: data.organizationId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        document: data.document,
      },
    });

    return CustomerMapper.toDomain(saved);
  }

  async findById(id: string, organizationId: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findFirst({
      where: { id, organizationId },
    });

    return customer ? CustomerMapper.toDomain(customer) : null;
  }

  async findByName(name: string, organizationId: string): Promise<Customer | null> {
    const normalizedName = name.trim();

    const customer = await this.prisma.customer.findFirst({
      where: {
        organizationId,
        archivedAt: null,
        name: {
          equals: normalizedName,
          mode: "insensitive",
        },
      },
    });

    return customer ? CustomerMapper.toDomain(customer) : null;
  }

  async listByOrganization(organizationId: string): Promise<Customer[]> {
    const customers = await this.prisma.customer.findMany({
      where: {
        organizationId,
        archivedAt: null,
      },
      orderBy: { name: "asc" },
    });

    return customers.map(CustomerMapper.toDomain);
  }
}
