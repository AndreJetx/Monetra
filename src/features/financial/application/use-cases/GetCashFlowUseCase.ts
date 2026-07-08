import type { IExpenseRepository } from "@/features/financial/domain/repositories/IExpenseRepository";
import type { IRevenueRepository } from "@/features/financial/domain/repositories/IRevenueRepository";
import {
  buildCashFlowBuckets,
  type CashFlowBucket,
  type CashFlowView,
} from "@/features/financial/shared/cashFlowPeriods";
import type { AuthContext } from "@/features/identity/application/authorize";
import { authorizeOrThrow } from "@/features/identity/application/authorize";

export type GetCashFlowQuery = {
  view: CashFlowView;
  from: Date;
  to: Date;
  categoryId?: string;
};

export type GetCashFlowResult = {
  totalRevenues: number;
  totalExpenses: number;
  balance: number;
  buckets: CashFlowBucket[];
};

export class GetCashFlowUseCase {
  constructor(
    private readonly revenueRepository: IRevenueRepository,
    private readonly expenseRepository: IExpenseRepository,
  ) {}

  async execute(query: GetCashFlowQuery, authContext: AuthContext): Promise<GetCashFlowResult> {
    authorizeOrThrow(authContext.role, "report:view");

    const [revenues, expenses] = await Promise.all([
      this.revenueRepository.listConfirmedByPeriod(
        authContext.organizationId,
        query.from,
        query.to,
        query.categoryId,
      ),
      this.expenseRepository.listConfirmedByPeriod(
        authContext.organizationId,
        query.from,
        query.to,
        query.categoryId,
      ),
    ]);

    const totalRevenues = revenues.reduce(
      (total, revenue) => total + revenue.toPrimitives().amount,
      0,
    );
    const totalExpenses = expenses.reduce(
      (total, expense) => total + expense.toPrimitives().amount,
      0,
    );

    const buckets = buildCashFlowBuckets(
      query.view,
      query.from,
      query.to,
      revenues
        .map((revenue) => {
          const data = revenue.toPrimitives();
          return {
            amount: data.amount,
            confirmedAt: data.receivedAt as Date,
          };
        })
        .filter((revenue) => revenue.confirmedAt !== null),
      expenses
        .map((expense) => {
          const data = expense.toPrimitives();
          return {
            amount: data.amount,
            confirmedAt: data.paidAt as Date,
          };
        })
        .filter((expense) => expense.confirmedAt !== null),
    );

    return {
      totalRevenues,
      totalExpenses,
      balance: totalRevenues - totalExpenses,
      buckets,
    };
  }
}
