import { beforeEach, describe, expect, it, vi } from "vitest";
import { OrganizationAccessDeniedError } from "@/features/organization/domain/errors/OrganizationAccessDeniedError";
import { switchOrganizationAction } from "@/features/organization/presentation/actions/organization.actions";

const { authMock, updateSessionMock, executeMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  updateSessionMock: vi.fn(),
  executeMock: vi.fn(),
}));

vi.mock("@/shared/auth/auth", () => ({
  auth: authMock,
  updateSession: updateSessionMock,
}));

vi.mock("@/features/organization/infrastructure/factories", () => ({
  createSwitchOrganizationUseCase: () => ({
    execute: executeMock,
  }),
}));

describe("switchOrganizationAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna erro quando usuário não está autenticado", async () => {
    authMock.mockResolvedValue(null);

    const formData = new FormData();
    formData.set("organizationId", "org-1");

    const result = await switchOrganizationAction({}, formData);
    expect(result.error).toBe("Usuário não autenticado");
  });

  it("atualiza sessão quando troca é válida", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1" },
    });

    executeMock.mockResolvedValue({ activeOrganizationId: "org-1" });

    const formData = new FormData();
    formData.set("organizationId", "org-1");

    const result = await switchOrganizationAction({}, formData);

    expect(result).toEqual({});
    expect(updateSessionMock).toHaveBeenCalledWith({
      user: {
        activeOrganizationId: "org-1",
      },
    });
  });

  it("retorna erro quando não há membership", async () => {
    authMock.mockResolvedValue({
      user: { id: "user-1" },
    });

    executeMock.mockRejectedValue(new OrganizationAccessDeniedError());

    const formData = new FormData();
    formData.set("organizationId", "org-2");

    const result = await switchOrganizationAction({}, formData);
    expect(result.error).toBe("Você não possui acesso a esta organização");
  });
});
