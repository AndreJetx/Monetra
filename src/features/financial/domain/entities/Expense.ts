import type { ExpenseStatus } from "@/features/financial/shared/types/ExpenseStatus";
import { InvalidExpenseAmountError } from "@/features/financial/domain/errors/InvalidExpenseAmountError";

type ExpenseProps = {
  id?: string;
  organizationId: string;
  amount: number;
  description: string | null;
  status: ExpenseStatus;
  dueDate: Date;
  paidAt: Date | null;
  categoryId: string;
  supplierId: string | null;
  createdBy: string;
  deletedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Expense {
  private constructor(private readonly props: ExpenseProps) {}

  static create(input: {
    id?: string;
    organizationId: string;
    amount: number;
    description?: string | null;
    dueDate: Date;
    categoryId: string;
    supplierId?: string | null;
    createdBy: string;
    status?: ExpenseStatus;
    paidAt?: Date | null;
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): Expense {
    if (input.amount <= 0) {
      throw new InvalidExpenseAmountError();
    }

    return new Expense({
      id: input.id,
      organizationId: input.organizationId,
      amount: input.amount,
      description: input.description?.trim() ?? null,
      status: input.status ?? "PENDING",
      dueDate: input.dueDate,
      paidAt: input.paidAt ?? null,
      categoryId: input.categoryId,
      supplierId: input.supplierId ?? null,
      createdBy: input.createdBy,
      deletedAt: input.deletedAt ?? null,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });
  }

  toPrimitives(): ExpenseProps {
    return { ...this.props };
  }
}
