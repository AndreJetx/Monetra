import { beforeEach, describe, expect, it, vi } from "vitest";
import { InvalidPasswordResetTokenError } from "@/features/identity/domain/errors/InvalidPasswordResetTokenError";
import { ExpiredPasswordResetTokenError } from "@/features/identity/domain/errors/ExpiredPasswordResetTokenError";
import {
  forgotPasswordAction,
  resetPasswordAction,
} from "@/features/identity/presentation/actions/password-reset.actions";

const { forgotExecuteMock, resetExecuteMock } = vi.hoisted(() => ({
  forgotExecuteMock: vi.fn(),
  resetExecuteMock: vi.fn(),
}));

vi.mock("@/features/identity/infrastructure/factories", () => ({
  createForgotPasswordUseCase: () => ({ execute: forgotExecuteMock }),
  createResetPasswordUseCase: () => ({ execute: resetExecuteMock }),
}));

describe("forgotPasswordAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna sucesso genérico para e-mail cadastrado", async () => {
    forgotExecuteMock.mockResolvedValue(undefined);

    const formData = new FormData();
    formData.set("email", "owner@monetra.dev");

    const result = await forgotPasswordAction({}, formData);

    expect(result.success).toBe(true);
    expect(forgotExecuteMock).toHaveBeenCalledWith({ email: "owner@monetra.dev" });
  });

  it("retorna sucesso genérico mesmo para e-mail desconhecido", async () => {
    forgotExecuteMock.mockResolvedValue(undefined);

    const formData = new FormData();
    formData.set("email", "unknown@monetra.dev");

    const result = await forgotPasswordAction({}, formData);

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("retorna erro de validação para e-mail malformado", async () => {
    const formData = new FormData();
    formData.set("email", "not-an-email");

    const result = await forgotPasswordAction({}, formData);

    expect(result.error).toBe("E-mail inválido");
    expect(forgotExecuteMock).not.toHaveBeenCalled();
  });
});

describe("resetPasswordAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function makeFormData(overrides: Record<string, string> = {}): FormData {
    const formData = new FormData();
    formData.set("token", overrides.token ?? "valid-token");
    formData.set("password", overrides.password ?? "NovaSenha123");
    formData.set("confirmPassword", overrides.confirmPassword ?? "NovaSenha123");
    return formData;
  }

  it("retorna sucesso quando redefinição é válida", async () => {
    resetExecuteMock.mockResolvedValue(undefined);

    const result = await resetPasswordAction({}, makeFormData());

    expect(result.success).toBe(true);
    expect(resetExecuteMock).toHaveBeenCalledWith({
      token: "valid-token",
      password: "NovaSenha123",
    });
  });

  it("retorna erro quando senhas não conferem", async () => {
    const result = await resetPasswordAction({}, makeFormData({ confirmPassword: "Outra123" }));

    expect(result.error).toBe("As senhas não conferem");
    expect(resetExecuteMock).not.toHaveBeenCalled();
  });

  it("traduz token inválido para mensagem de UI", async () => {
    resetExecuteMock.mockRejectedValue(new InvalidPasswordResetTokenError());

    const result = await resetPasswordAction({}, makeFormData());

    expect(result.error).toBe("Link de recuperação inválido. Solicite um novo.");
  });

  it("traduz token expirado para mensagem de UI", async () => {
    resetExecuteMock.mockRejectedValue(new ExpiredPasswordResetTokenError());

    const result = await resetPasswordAction({}, makeFormData());

    expect(result.error).toBe("Link de recuperação expirado. Solicite um novo.");
  });
});
