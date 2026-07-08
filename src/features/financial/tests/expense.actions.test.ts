import { beforeEach, describe, expect, it, vi } from "vitest";
import { InsufficientPermissionError } from "@/features/identity/domain/errors/InsufficientPermissionError";
import {
  confirmExpensePaymentAction,
  createExpenseAction,
} from "@/features/financial/presentation/actions/expense.actions";
import { ExpenseNotFoundError } from "@/features/financial/domain/errors/ExpenseNotFoundError";

const { authMock, createExpenseExecuteMock, confirmExpenseExecuteMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  createExpenseExecuteMock: vi.fn(),
  confirmExpenseExecuteMock: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/shared/auth/auth", () => ({
  auth: authMock,
}));

vi.mock("@/features/financial/infrastructure/factories", () => ({
  createCreateExpenseUseCase: () => ({ execute: createExpenseExecuteMock }),
  createConfirmExpensePaymentUseCase: () => ({ execute: confirmExpenseExecuteMock }),
  createListCategoriesUseCase: () => ({ execute: vi.fn() }),
  createListExpensesUseCase: () => ({ execute: vi.fn() }),
}));

describe("createExpenseAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function makeFormData(overrides: Record<string, string> = {}) {
    const formData = new FormData();
    formData.set("amount", overrides.amount ?? "500");
    formData.set("categoryId", overrides.categoryId ?? "cat-1");
    formData.set("dueDate", overrides.dueDate ?? "2026-07-15");
    formData.set("description", overrides.description ?? "Aluguel");
    return formData;
  }

  it("retorna erro quando sessao nao existe", async () => {
    authMock.mockResolvedValue(null);

    const result = await createExpenseAction({}, makeFormData());

    expect(result.error).toBe("Usuario nao autenticado");
  });

  it("retorna sucesso para MEMBER", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1", activeOrganizationId: "org-1", role: "MEMBER" },
    });
    createExpenseExecuteMock.mockResolvedValue(undefined);

    const result = await createExpenseAction({}, makeFormData());

    expect(result.success).toBe(true);
  });

  it("retorna sucesso para ADMIN", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1", activeOrganizationId: "org-1", role: "ADMIN" },
    });
    createExpenseExecuteMock.mockResolvedValue(undefined);

    const result = await createExpenseAction({}, makeFormData());

    expect(result.success).toBe(true);
  });

  it("retorna sucesso para OWNER", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1", activeOrganizationId: "org-1", role: "OWNER" },
    });
    createExpenseExecuteMock.mockResolvedValue(undefined);

    const result = await createExpenseAction({}, makeFormData());

    expect(result.success).toBe(true);
  });

  it("retorna erro de validacao", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1", activeOrganizationId: "org-1", role: "MEMBER" },
    });

    const result = await createExpenseAction({}, makeFormData({ amount: "0" }));

    expect(result.error).toBe("Valor deve ser maior que zero");
    expect(createExpenseExecuteMock).not.toHaveBeenCalled();
  });

  it("traduz erro de permissao", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1", activeOrganizationId: "org-1", role: "VIEWER" },
    });
    createExpenseExecuteMock.mockRejectedValue(new InsufficientPermissionError());

    const result = await createExpenseAction({}, makeFormData());

    expect(result.error).toBe("Voce nao possui permissao para cadastrar despesas");
  });
});

describe("confirmExpensePaymentAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function makeConfirmFormData(overrides: Record<string, string> = {}) {
    const formData = new FormData();
    formData.set("id", overrides.id ?? "exp-1");
    if (overrides.paidAt) {
      formData.set("paidAt", overrides.paidAt);
    }
    return formData;
  }

  it("retorna erro quando sessao nao existe", async () => {
    authMock.mockResolvedValue(null);

    const result = await confirmExpensePaymentAction({}, makeConfirmFormData());

    expect(result.error).toBe("Usuario nao autenticado");
  });

  it("retorna sucesso para MEMBER", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1", activeOrganizationId: "org-1", role: "MEMBER" },
    });
    confirmExpenseExecuteMock.mockResolvedValue(undefined);

    const result = await confirmExpensePaymentAction({}, makeConfirmFormData());

    expect(result.success).toBe(true);
  });

  it("traduz erro de permissao", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1", activeOrganizationId: "org-1", role: "VIEWER" },
    });
    confirmExpenseExecuteMock.mockRejectedValue(new InsufficientPermissionError());

    const result = await confirmExpensePaymentAction({}, makeConfirmFormData());

    expect(result.error).toBe("Voce nao possui permissao para confirmar pagamento");
  });

  it("traduz erro de despesa nao encontrada", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1", activeOrganizationId: "org-1", role: "MEMBER" },
    });
    confirmExpenseExecuteMock.mockRejectedValue(new ExpenseNotFoundError());

    const result = await confirmExpensePaymentAction({}, makeConfirmFormData());

    expect(result.error).toBe("Despesa nao encontrada");
  });
});
