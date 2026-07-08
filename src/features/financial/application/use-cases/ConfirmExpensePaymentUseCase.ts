import type { AuthContext } from "@/features/identity/application/authorize";
import { authorizeOrThrow } from "@/features/identity/application/authorize";
import type { IExpenseRepository } from "@/features/financial/domain/repositories/IExpenseRepository";
import { ExpenseNotFoundError } from "@/features/financial/domain/errors/ExpenseNotFoundError";

type ConfirmExpensePaymentInput = {
  id: string;
  paidAt?: Date;
};

export class ConfirmExpensePaymentUseCase {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute(input: ConfirmExpensePaymentInput, authContext: AuthContext) {
    authorizeOrThrow(authContext.role, "expense:edit");

    const expense = await this.expenseRepository.findById(input.id, authContext.organizationId);

    if (!expense) {
      throw new ExpenseNotFoundError();
    }

    expense.confirmPayment(input.paidAt);
    return this.expenseRepository.update(expense);
  }
}
