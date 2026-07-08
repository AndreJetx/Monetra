import type { IExpenseRepository } from "@/features/financial/domain/repositories/IExpenseRepository";
import type { AuthContext } from "@/features/identity/application/authorize";

export class ListExpensesUseCase {
  constructor(private readonly expenseRepository: IExpenseRepository) {}

  async execute(authContext: AuthContext) {
    return this.expenseRepository.listByOrganization(authContext.organizationId);
  }
}
