import { describe, expect, it, vi } from "vitest";
import { ConfirmRevenueReceiptUseCase } from "@/features/financial/application/use-cases/ConfirmRevenueReceiptUseCase";
import { Revenue } from "@/features/financial/domain/entities/Revenue";
import { RevenueNotFoundError } from "@/features/financial/domain/errors/RevenueNotFoundError";
import { RevenueNotPendingError } from "@/features/financial/domain/errors/RevenueNotPendingError";
import type { IRevenueRepository } from "@/features/financial/domain/repositories/IRevenueRepository";
import { InsufficientPermissionError } from "@/features/identity/domain/errors/InsufficientPermissionError";
import { Role } from "@/features/identity/shared/types/Role";

const authContext = {
  userId: "user-1",
  organizationId: "org-1",
  role: Role.MEMBER,
};

function makeRevenue(status: "PENDING" | "RECEIVED" = "PENDING") {
  return Revenue.create({
    id: "rev-1",
    organizationId: "org-1",
    amount: 1000,
    dueDate: new Date("2026-07-09"),
    categoryId: "cat-1",
    createdBy: "user-1",
    status,
  });
}

describe("ConfirmRevenueReceiptUseCase", () => {
  it("confirma receita pendente e define receivedAt", async () => {
    const repository: IRevenueRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(makeRevenue("PENDING")),
      update: vi.fn().mockImplementation(async (revenue) => revenue),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn(),
    };

    const useCase = new ConfirmRevenueReceiptUseCase(repository);
    const receivedAt = new Date("2026-07-10");

    const result = await useCase.execute({ id: "rev-1", receivedAt }, authContext);

    expect(result.toPrimitives().status).toBe("RECEIVED");
    expect(result.toPrimitives().receivedAt).toEqual(receivedAt);
    expect(repository.update).toHaveBeenCalled();
  });

  it("falha quando receita nao existe", async () => {
    const repository: IRevenueRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(null),
      update: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn(),
    };

    const useCase = new ConfirmRevenueReceiptUseCase(repository);

    await expect(useCase.execute({ id: "missing" }, authContext)).rejects.toThrow(
      RevenueNotFoundError,
    );
  });

  it("falha quando receita nao esta pendente", async () => {
    const repository: IRevenueRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(makeRevenue("RECEIVED")),
      update: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn(),
    };

    const useCase = new ConfirmRevenueReceiptUseCase(repository);

    await expect(useCase.execute({ id: "rev-1" }, authContext)).rejects.toThrow(
      RevenueNotPendingError,
    );
  });

  it("nega confirmacao para VIEWER", async () => {
    const repository: IRevenueRepository = {
      save: vi.fn(),
      findById: vi.fn().mockResolvedValue(makeRevenue("PENDING")),
      update: vi.fn(),
      listByOrganization: vi.fn(),
      listConfirmedByPeriod: vi.fn(),
    };

    const useCase = new ConfirmRevenueReceiptUseCase(repository);

    await expect(
      useCase.execute({ id: "rev-1" }, { ...authContext, role: Role.VIEWER }),
    ).rejects.toThrow(InsufficientPermissionError);
  });
});
