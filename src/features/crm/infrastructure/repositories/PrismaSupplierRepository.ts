import type { PrismaClient } from "@prisma/client";
import type { Supplier } from "@/features/crm/domain/entities/Supplier";
import type { ISupplierRepository } from "@/features/crm/domain/repositories/ISupplierRepository";
import { SupplierMapper } from "@/features/crm/infrastructure/mappers/SupplierMapper";

export class PrismaSupplierRepository implements ISupplierRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(supplier: Supplier): Promise<Supplier> {
    const data = supplier.toPrimitives();

    const saved = await this.prisma.supplier.create({
      data: {
        organizationId: data.organizationId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        document: data.document,
      },
    });

    return SupplierMapper.toDomain(saved);
  }

  async findById(id: string, organizationId: string): Promise<Supplier | null> {
    const supplier = await this.prisma.supplier.findFirst({
      where: { id, organizationId },
    });

    return supplier ? SupplierMapper.toDomain(supplier) : null;
  }

  async findByName(name: string, organizationId: string): Promise<Supplier | null> {
    const normalizedName = name.trim();

    const supplier = await this.prisma.supplier.findFirst({
      where: {
        organizationId,
        archivedAt: null,
        name: {
          equals: normalizedName,
          mode: "insensitive",
        },
      },
    });

    return supplier ? SupplierMapper.toDomain(supplier) : null;
  }

  async listByOrganization(organizationId: string): Promise<Supplier[]> {
    const suppliers = await this.prisma.supplier.findMany({
      where: {
        organizationId,
        archivedAt: null,
      },
      orderBy: { name: "asc" },
    });

    return suppliers.map(SupplierMapper.toDomain);
  }
}
