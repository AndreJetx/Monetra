import { Expense } from "@/features/financial/domain/entities/Expense";
import { ExpenseCategoryNotFoundError } from "@/features/financial/domain/errors/ExpenseCategoryNotFoundError";
import { ExpenseCategoryTypeMismatchError } from "@/features/financial/domain/errors/ExpenseCategoryTypeMismatchError";
import { SupplierArchivedError } from "@/features/crm/domain/errors/SupplierArchivedError";
import { SupplierNotFoundError } from "@/features/crm/domain/errors/SupplierNotFoundError";
import type { ISupplierRepository } from "@/features/crm/domain/repositories/ISupplierRepository";
import type { ICategoryRepository } from "@/features/financial/domain/repositories/ICategoryRepository";
import type { IExpenseRepository } from "@/features/financial/domain/repositories/IExpenseRepository";
import type { AuthContext } from "@/features/identity/application/authorize";
import { authorizeOrThrow } from "@/features/identity/application/authorize";
import { CategoryType } from "@/features/financial/shared/types/CategoryType";

type CreateExpenseInput = {
  amount: number;
  categoryId: string;
  dueDate: Date;
  supplierId?: string;
  description?: string;
};

export class CreateExpenseUseCase {
  constructor(
    private readonly expenseRepository: IExpenseRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly supplierRepository: ISupplierRepository,
  ) {}

  async execute(input: CreateExpenseInput, authContext: AuthContext): Promise<Expense> {
    authorizeOrThrow(authContext.role, "expense:create");

    const category = await this.categoryRepository.findById(
      input.categoryId,
      authContext.organizationId,
    );

    if (!category) {
      throw new ExpenseCategoryNotFoundError();
    }

    if (category.getType() !== CategoryType.EXPENSE) {
      throw new ExpenseCategoryTypeMismatchError();
    }

    if (input.supplierId) {
      const supplier = await this.supplierRepository.findById(
        input.supplierId,
        authContext.organizationId,
      );

      if (!supplier) {
        throw new SupplierNotFoundError();
      }

      if (supplier.isArchived()) {
        throw new SupplierArchivedError();
      }
    }

    const expense = Expense.create({
      organizationId: authContext.organizationId,
      amount: input.amount,
      description: input.description,
      dueDate: input.dueDate,
      categoryId: input.categoryId,
      supplierId: input.supplierId,
      createdBy: authContext.userId,
    });

    return this.expenseRepository.save(expense);
  }
}
