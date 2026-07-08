import { beforeEach, describe, expect, it, vi } from "vitest";
import { InsufficientPermissionError } from "@/features/identity/domain/errors/InsufficientPermissionError";
import { SupplierNameAlreadyExistsError } from "@/features/crm/domain/errors/SupplierNameAlreadyExistsError";
import { createSupplierAction } from "@/features/crm/presentation/actions/supplier.actions";

const { authMock, createExecuteMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  createExecuteMock: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/shared/auth/auth", () => ({
  auth: authMock,
}));

vi.mock("@/features/crm/infrastructure/factories", () => ({
  createCreateSupplierUseCase: () => ({ execute: createExecuteMock }),
  createListSuppliersUseCase: () => ({ execute: vi.fn() }),
}));

describe("createSupplierAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function makeFormData(overrides: Record<string, string> = {}) {
    const formData = new FormData();
    formData.set("name", overrides.name ?? "Fornecedor XPTO");
    if (overrides.email) formData.set("email", overrides.email);
    if (overrides.phone) formData.set("phone", overrides.phone);
    if (overrides.document) formData.set("document", overrides.document);
    return formData;
  }

  it("retorna erro quando sessao nao existe", async () => {
    authMock.mockResolvedValue(null);

    const result = await createSupplierAction({}, makeFormData());

    expect(result.error).toBe("Usuario nao autenticado");
  });

  it("retorna sucesso para MEMBER", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1", activeOrganizationId: "org-1", role: "MEMBER" },
    });
    createExecuteMock.mockResolvedValue(undefined);

    const result = await createSupplierAction({}, makeFormData());

    expect(result.success).toBe(true);
  });

  it("bloqueia criacao para VIEWER", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1", activeOrganizationId: "org-1", role: "VIEWER" },
    });
    createExecuteMock.mockRejectedValue(new InsufficientPermissionError());

    const result = await createSupplierAction({}, makeFormData());

    expect(result.error).toBe("Voce nao possui permissao para cadastrar fornecedores");
  });

  it("retorna erro de nome duplicado", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1", activeOrganizationId: "org-1", role: "MEMBER" },
    });
    createExecuteMock.mockRejectedValue(new SupplierNameAlreadyExistsError());

    const result = await createSupplierAction({}, makeFormData());

    expect(result.error).toBe("Ja existe um fornecedor com este nome na organizacao");
  });
});
