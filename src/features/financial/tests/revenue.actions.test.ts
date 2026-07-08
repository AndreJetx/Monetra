import { beforeEach, describe, expect, it, vi } from "vitest";
import { InsufficientPermissionError } from "@/features/identity/domain/errors/InsufficientPermissionError";
import { createRevenueAction } from "@/features/financial/presentation/actions/revenue.actions";

const { authMock, createRevenueExecuteMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  createRevenueExecuteMock: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/shared/auth/auth", () => ({
  auth: authMock,
}));

vi.mock("@/features/financial/infrastructure/factories", () => ({
  createCreateRevenueUseCase: () => ({ execute: createRevenueExecuteMock }),
  createListCategoriesUseCase: () => ({ execute: vi.fn() }),
  createListRevenuesUseCase: () => ({ execute: vi.fn() }),
}));

describe("createRevenueAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function makeFormData(overrides: Record<string, string> = {}) {
    const formData = new FormData();
    formData.set("amount", overrides.amount ?? "1000");
    formData.set("categoryId", overrides.categoryId ?? "cat-1");
    formData.set("dueDate", overrides.dueDate ?? "2026-07-09");
    formData.set("description", overrides.description ?? "Venda");
    return formData;
  }

  it("retorna erro quando sessao nao existe", async () => {
    authMock.mockResolvedValue(null);

    const result = await createRevenueAction({}, makeFormData());

    expect(result.error).toBe("Usuario nao autenticado");
  });

  it("retorna sucesso para MEMBER", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1", activeOrganizationId: "org-1", role: "MEMBER" },
    });
    createRevenueExecuteMock.mockResolvedValue(undefined);

    const result = await createRevenueAction({}, makeFormData());

    expect(result.success).toBe(true);
  });

  it("retorna sucesso para ADMIN", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1", activeOrganizationId: "org-1", role: "ADMIN" },
    });
    createRevenueExecuteMock.mockResolvedValue(undefined);

    const result = await createRevenueAction({}, makeFormData());

    expect(result.success).toBe(true);
  });

  it("retorna sucesso para OWNER", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1", activeOrganizationId: "org-1", role: "OWNER" },
    });
    createRevenueExecuteMock.mockResolvedValue(undefined);

    const result = await createRevenueAction({}, makeFormData());

    expect(result.success).toBe(true);
  });

  it("retorna erro de validacao", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1", activeOrganizationId: "org-1", role: "MEMBER" },
    });

    const result = await createRevenueAction({}, makeFormData({ amount: "0" }));

    expect(result.error).toBe("Valor deve ser maior que zero");
    expect(createRevenueExecuteMock).not.toHaveBeenCalled();
  });

  it("traduz erro de permissao", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1", activeOrganizationId: "org-1", role: "VIEWER" },
    });
    createRevenueExecuteMock.mockRejectedValue(new InsufficientPermissionError());

    const result = await createRevenueAction({}, makeFormData());

    expect(result.error).toBe("Voce nao possui permissao para cadastrar receitas");
  });
});
