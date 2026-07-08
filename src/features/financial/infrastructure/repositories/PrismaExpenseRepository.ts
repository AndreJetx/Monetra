import type { PrismaClient } from "@prisma/client";
import type { IExpenseRepository } from "@/features/financial/domain/repositories/IExpenseRepository";
import type { Expense } from "@/features/financial/domain/entities/Expense";
import { ExpenseMapper } from "@/features/financial/infrastructure/mappers/ExpenseMapper";

export class PrismaExpenseRepository implements IExpenseRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(expense: Expense): Promise<Expense> {
    const data = expense.toPrimitives();

    const saved = await this.prisma.expense.create({
      data: {
        organizationId: data.organizationId,
        amount: data.amount,
        description: data.description,
        status: data.status,
        dueDate: data.dueDate,
        paidAt: data.paidAt,
        categoryId: data.categoryId,
        supplierId: data.supplierId,
        createdBy: data.createdBy,
      },
    });

    return ExpenseMapper.toDomain(saved);
  }

  async listByOrganization(organizationId: string): Promise<Expense[]> {
    const expenses = await this.prisma.expense.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      orderBy: { dueDate: "desc" },
    });

    return expenses.map((expense) => ExpenseMapper.toDomain(expense));
  }

  async findById(id: string, organizationId: string): Promise<Expense | null> {
    const expense = await this.prisma.expense.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
    });

    return expense ? ExpenseMapper.toDomain(expense) : null;
  }

  async update(expense: Expense): Promise<Expense> {
    const data = expense.toPrimitives();

    if (!data.id) {
      throw new Error("Expense ID is required for update");
    }

    const updated = await this.prisma.expense.update({
      where: { id: data.id },
      data: {
        status: data.status,
        paidAt: data.paidAt,
      },
    });

    return ExpenseMapper.toDomain(updated);
  }
}
