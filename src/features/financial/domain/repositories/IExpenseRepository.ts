import type { Expense } from "@/features/financial/domain/entities/Expense";

export interface IExpenseRepository {
  save(expense: Expense): Promise<Expense>;
  findById(id: string, organizationId: string): Promise<Expense | null>;
  update(expense: Expense): Promise<Expense>;
  listByOrganization(organizationId: string): Promise<Expense[]>;
}
