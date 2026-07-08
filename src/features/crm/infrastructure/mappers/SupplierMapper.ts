import { Supplier } from "@/features/crm/domain/entities/Supplier";

export class SupplierMapper {
  static toDomain(record: {
    id: string;
    organizationId: string;
    name: string;
    email: string | null;
    phone: string | null;
    document: string | null;
    archivedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Supplier {
    return Supplier.create({
      id: record.id,
      organizationId: record.organizationId,
      name: record.name,
      email: record.email,
      phone: record.phone,
      document: record.document,
      archivedAt: record.archivedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
