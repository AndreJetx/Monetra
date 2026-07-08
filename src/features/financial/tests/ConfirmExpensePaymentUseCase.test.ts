import { describe, expect, it, vi } from "vitest";
import { ConfirmExpensePaymentUseCase } from "@/features/financial/application/use-cases/ConfirmExpensePaymentUseCase";
import { Expense } from "@/features/financial/domain/entities/Expense";
import { ExpenseNotFoundError } from "@/features/financial/domain/errors/ExpenseNotFoundError";
import { ExpenseNotPendingError } from "@/features/financial/domain/errors/ExpenseNotPendingError";
import type { IExpenseRepository } from "@/features/financial/domain/repositories/IExpenseRepository";
import { InsufficientPermissionError } from "@/features/identity/domain/errors/InsufficientPermissionError";
import { Role } from "@/features/identity/shared/types/Role";

const authContext = {
  userId: "user-1",
  organizationId: "org-1",
  role: Role.MEMBER,
};

function makeExpense(status: "PENDING" | "PAID" = "PENDING") {
  return Expense.create({
    id: "exp-1",
    organizationId: "org-1",
    amount: 500,
    dueDate: new Date("2026-07-09"),
    categoryId: "cat-1",
    createdBy: "user-1",
    status,
  });
}

describe("ConfirmExpensePaymentUseCase", () => {
  it("confirma despesa pendente e define paidAt", async () => {
    const repository: IExpenseRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(makeExpense("PENDING")),
      update: vi.fn().mockImplementation(async (expense) => expense),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn(),
    };

    const useCase = new ConfirmExpensePaymentUseCase(repository);
    const paidAt = new Date("2026-07-10");

    const result = await useCase.execute({ id: "exp-1", paidAt }, authContext);

    expect(result.toPrimitives().status).toBe("PAID");
    expect(result.toPrimitives().paidAt).toEqual(paidAt);
    expect(repository.update).toHaveBeenCalled();
  });

  it("falha quando despesa nao existe", async () => {
    const repository: IExpenseRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(null),
      update: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn(),
    };

    const useCase = new ConfirmExpensePaymentUseCase(repository);

    await expect(useCase.execute({ id: "missing" }, authContext)).rejects.toThrow(
      ExpenseNotFoundError,
    );
  });

  it("falha quando despesa nao esta pendente", async () => {
    const repository: IExpenseRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(makeExpense("PAID")),
      update: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn(),
    };

    const useCase = new ConfirmExpensePaymentUseCase(repository);

    await expect(useCase.execute({ id: "exp-1" }, authContext)).rejects.toThrow(
      ExpenseNotPendingError,
    );
  });

  it("nega confirmacao para VIEWER", async () => {
    const repository: IExpenseRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(makeExpense("PENDING")),
      update: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn(),
    };

    const useCase = new ConfirmExpensePaymentUseCase(repository);

    await expect(
      useCase.execute({ id: "exp-1" }, { ...authContext, role: Role.VIEWER }),
    ).rejects.toThrow(InsufficientPermissionError);
  });
});
