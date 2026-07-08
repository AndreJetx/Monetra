import { Expense } from "@/features/financial/domain/entities/Expense";
import type { ExpenseStatus } from "@/features/financial/shared/types/ExpenseStatus";

export class ExpenseMapper {
  static toDomain(record: {
    id: string;
    organizationId: string;
    amount: { toNumber: () => number } | number;
    description: string | null;
    status: ExpenseStatus;
    dueDate: Date;
    paidAt: Date | null;
    categoryId: string;
    supplierId: string | null;
    createdBy: string;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Expense {
    const amountValue =
      typeof record.amount === "number" ? record.amount : record.amount.toNumber();

    return Expense.create({
      id: record.id,
      organizationId: record.organizationId,
      amount: amountValue,
      description: record.description ?? undefined,
      status: record.status,
      dueDate: record.dueDate,
      paidAt: record.paidAt,
      categoryId: record.categoryId,
      supplierId: record.supplierId ?? undefined,
      createdBy: record.createdBy,
      deletedAt: record.deletedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
