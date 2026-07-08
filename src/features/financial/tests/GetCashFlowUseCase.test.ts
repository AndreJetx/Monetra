import { describe, expect, it, vi } from "vitest";
import { GetCashFlowUseCase } from "@/features/financial/application/use-cases/GetCashFlowUseCase";
import { Expense } from "@/features/financial/domain/entities/Expense";
import { Revenue } from "@/features/financial/domain/entities/Revenue";
import type { IExpenseRepository } from "@/features/financial/domain/repositories/IExpenseRepository";
import type { IRevenueRepository } from "@/features/financial/domain/repositories/IRevenueRepository";
import { Role } from "@/features/identity/shared/types/Role";

const memberContext = {
  userId: "user-1",
  organizationId: "org-1",
  role: Role.MEMBER,
};

const viewerContext = {
  userId: "user-2",
  organizationId: "org-1",
  role: Role.VIEWER,
};

function createRevenue(amount: number, receivedAt: Date, categoryId = "cat-revenue") {
  return Revenue.create({
    id: `rev-${amount}`,
    organizationId: "org-1",
    amount,
    dueDate: receivedAt,
    categoryId,
    createdBy: "user-1",
    status: "RECEIVED",
    receivedAt,
  });
}

function createExpense(amount: number, paidAt: Date, categoryId = "cat-expense") {
  return Expense.create({
    id: `exp-${amount}`,
    organizationId: "org-1",
    amount,
    dueDate: paidAt,
    categoryId,
    createdBy: "user-1",
    status: "PAID",
    paidAt,
  });
}

describe("GetCashFlowUseCase", () => {
  it("calcula saldo apenas com movimentacoes confirmadas", async () => {
    const revenueRepository: IRevenueRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi
        .fn()
        .mockResolvedValue([
          createRevenue(1000, new Date(2026, 6, 5)),
          createRevenue(500, new Date(2026, 6, 10)),
        ]),
    };

    const expenseRepository: IExpenseRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn().mockResolvedValue([createExpense(300, new Date(2026, 6, 8))]),
    };

    const useCase = new GetCashFlowUseCase(revenueRepository, expenseRepository);
    const result = await useCase.execute(
      {
        view: "monthly",
        from: new Date(2026, 6, 1),
        to: new Date(2026, 6, 31),
      },
      memberContext,
    );

    expect(result.totalRevenues).toBe(1500);
    expect(result.totalExpenses).toBe(300);
    expect(result.balance).toBe(1200);
  });

  it("agrupa movimentacoes por visao diaria", async () => {
    const revenueRepository: IRevenueRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi
        .fn()
        .mockResolvedValue([
          createRevenue(100, new Date(2026, 6, 1)),
          createRevenue(200, new Date(2026, 6, 2)),
        ]),
    };

    const expenseRepository: IExpenseRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn().mockResolvedValue([createExpense(50, new Date(2026, 6, 1))]),
    };

    const useCase = new GetCashFlowUseCase(revenueRepository, expenseRepository);
    const result = await useCase.execute(
      {
        view: "daily",
        from: new Date(2026, 6, 1),
        to: new Date(2026, 6, 2),
      },
      memberContext,
    );

    expect(result.buckets).toEqual([
      { period: "2026-07-01", revenues: 100, expenses: 50, balance: 50 },
      { period: "2026-07-02", revenues: 200, expenses: 0, balance: 200 },
    ]);
  });

  it("repassa filtro de categoria aos repositorios", async () => {
    const revenueRepository: IRevenueRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn().mockResolvedValue([]),
    };

    const expenseRepository: IExpenseRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn().mockResolvedValue([]),
    };

    const useCase = new GetCashFlowUseCase(revenueRepository, expenseRepository);
    const from = new Date(2026, 6, 1);
    const to = new Date(2026, 6, 31);

    await useCase.execute(
      {
        view: "monthly",
        from,
        to,
        categoryId: "cat-1",
      },
      memberContext,
    );

    expect(revenueRepository.listConfirmedByPeriod).toHaveBeenCalledWith(
      "org-1",
      from,
      to,
      "cat-1",
    );
    expect(expenseRepository.listConfirmedByPeriod).toHaveBeenCalledWith(
      "org-1",
      from,
      to,
      "cat-1",
    );
  });

  it("permite acesso para VIEWER com report:view", async () => {
    const revenueRepository: IRevenueRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn().mockResolvedValue([]),
    };

    const expenseRepository: IExpenseRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn().mockResolvedValue([]),
    };

    const useCase = new GetCashFlowUseCase(revenueRepository, expenseRepository);

    await expect(
      useCase.execute(
        {
          view: "monthly",
          from: new Date(2026, 6, 1),
          to: new Date(2026, 6, 31),
        },
        viewerContext,
      ),
    ).resolves.toMatchObject({
      totalRevenues: 0,
      totalExpenses: 0,
      balance: 0,
    });
  });
});
