import type { RevenueStatus } from "@/features/financial/shared/types/RevenueStatus";
import { InvalidRevenueAmountError } from "@/features/financial/domain/errors/InvalidRevenueAmountError";

type RevenueProps = {
  id?: string;
  organizationId: string;
  amount: number;
  description: string | null;
  status: RevenueStatus;
  dueDate: Date;
  receivedAt: Date | null;
  categoryId: string;
  customerId: string | null;
  createdBy: string;
  deletedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Revenue {
  private constructor(private readonly props: RevenueProps) {}

  static create(input: {
    id?: string;
    organizationId: string;
    amount: number;
    description?: string | null;
    dueDate: Date;
    categoryId: string;
    customerId?: string | null;
    createdBy: string;
    status?: RevenueStatus;
    receivedAt?: Date | null;
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): Revenue {
    if (input.amount <= 0) {
      throw new InvalidRevenueAmountError();
    }

    return new Revenue({
      id: input.id,
      organizationId: input.organizationId,
      amount: input.amount,
      description: input.description?.trim() ?? null,
      status: input.status ?? "PENDING",
      dueDate: input.dueDate,
      receivedAt: input.receivedAt ?? null,
      categoryId: input.categoryId,
      customerId: input.customerId ?? null,
      createdBy: input.createdBy,
      deletedAt: input.deletedAt ?? null,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });
  }

  toPrimitives(): RevenueProps {
    return { ...this.props };
  }
}
