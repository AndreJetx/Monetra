import { Revenue } from "@/features/financial/domain/entities/Revenue";
import type { RevenueStatus } from "@/features/financial/shared/types/RevenueStatus";

export class RevenueMapper {
  static toDomain(record: {
    id: string;
    organizationId: string;
    amount: { toNumber: () => number } | number;
    description: string | null;
    status: RevenueStatus;
    dueDate: Date;
    receivedAt: Date | null;
    categoryId: string;
    customerId: string | null;
    createdBy: string;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Revenue {
    const amountValue =
      typeof record.amount === "number" ? record.amount : record.amount.toNumber();

    return Revenue.create({
      id: record.id,
      organizationId: record.organizationId,
      amount: amountValue,
      description: record.description ?? undefined,
      status: record.status,
      dueDate: record.dueDate,
      receivedAt: record.receivedAt,
      categoryId: record.categoryId,
      customerId: record.customerId ?? undefined,
      createdBy: record.createdBy,
      deletedAt: record.deletedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
