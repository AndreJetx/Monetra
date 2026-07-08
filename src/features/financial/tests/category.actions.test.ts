import { beforeEach, describe, expect, it, vi } from "vitest";
import { InsufficientPermissionError } from "@/features/identity/domain/errors/InsufficientPermissionError";
import {
  archiveCategoryAction,
  createCategoryAction,
} from "@/features/financial/presentation/actions/category.actions";

const { authMock, createExecuteMock, archiveExecuteMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  createExecuteMock: vi.fn(),
  archiveExecuteMock: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/shared/auth/auth", () => ({
  auth: authMock,
}));

vi.mock("@/features/financial/infrastructure/factories", () => ({
  createCreateCategoryUseCase: () => ({ execute: createExecuteMock }),
  createUpdateCategoryUseCase: () => ({ execute: vi.fn() }),
  createArchiveCategoryUseCase: () => ({ execute: archiveExecuteMock }),
}));

describe("category.actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna erro quando nao ha sessao", async () => {
    authMock.mockResolvedValue(null);
    const formData = new FormData();
    formData.set("name", "Marketing");
    formData.set("type", "EXPENSE");

    const result = await createCategoryAction({}, formData);
    expect(result.error).toBe("Usuario nao autenticado");
  });

  it("bloqueia criacao para VIEWER", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1", activeOrganizationId: "org-1", role: "VIEWER" },
    });
    createExecuteMock.mockRejectedValue(new InsufficientPermissionError());

    const formData = new FormData();
    formData.set("name", "Marketing");
    formData.set("type", "EXPENSE");

    const result = await createCategoryAction({}, formData);
    expect(result.error).toBe("Voce nao possui permissao para gerenciar categorias");
  });

  it("permite criacao para ADMIN", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1", activeOrganizationId: "org-1", role: "ADMIN" },
    });
    createExecuteMock.mockResolvedValue(undefined);

    const formData = new FormData();
    formData.set("name", "Marketing");
    formData.set("type", "EXPENSE");

    const result = await createCategoryAction({}, formData);
    expect(result.success).toBe(true);
  });

  it("permite arquivar categoria para ADMIN", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1", activeOrganizationId: "org-1", role: "ADMIN" },
    });
    archiveExecuteMock.mockResolvedValue(undefined);

    const formData = new FormData();
    formData.set("id", "cat-1");

    const result = await archiveCategoryAction({}, formData);
    expect(result.success).toBe(true);
  });
});
