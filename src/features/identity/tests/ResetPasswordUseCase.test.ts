import { describe, expect, it, vi } from "vitest";
import { ResetPasswordUseCase } from "@/features/identity/application/use-cases/ResetPasswordUseCase";
import { InvalidPasswordResetTokenError } from "@/features/identity/domain/errors/InvalidPasswordResetTokenError";
import { ExpiredPasswordResetTokenError } from "@/features/identity/domain/errors/ExpiredPasswordResetTokenError";
import { WeakPasswordError } from "@/features/identity/domain/errors/WeakPasswordError";
import type { IUserRepository } from "@/features/identity/domain/repositories/IUserRepository";
import type {
  IPasswordResetTokenRepository,
  PasswordResetToken,
} from "@/features/identity/domain/repositories/IPasswordResetTokenRepository";
import type { IPasswordHasher } from "@/features/identity/application/ports/IPasswordHasher";

const validToken: PasswordResetToken = {
  email: "owner@monetra.dev",
  token: "valid-token",
  expiresAt: new Date(Date.now() + 60 * 60 * 1000),
};

function makeTokenRepository(token: PasswordResetToken | null): IPasswordResetTokenRepository {
  return {
    create: vi.fn(),
    findByToken: vi.fn().mockResolvedValue(token),
    deleteAllForEmail: vi.fn(),
  };
}

function makeUserRepository(): IUserRepository {
  return {
    existsByEmail: vi.fn(),
    findByEmail: vi.fn().mockResolvedValue({
      id: "user-1",
      name: "Owner",
      email: "owner@monetra.dev",
      image: null,
      passwordHash: "old-hash",
    }),
    updatePasswordHash: vi.fn(),
  };
}

const passwordHasher: IPasswordHasher = {
  hash: vi.fn().mockResolvedValue("new-hash"),
  compare: vi.fn(),
};

describe("ResetPasswordUseCase", () => {
  it("atualiza senha e consome token quando token é válido", async () => {
    const userRepository = makeUserRepository();
    const tokenRepository = makeTokenRepository(validToken);

    const useCase = new ResetPasswordUseCase(userRepository, tokenRepository, passwordHasher);

    await useCase.execute({ token: "valid-token", password: "NovaSenha123" });

    expect(userRepository.updatePasswordHash).toHaveBeenCalledWith("user-1", "new-hash");
    expect(tokenRepository.deleteAllForEmail).toHaveBeenCalledWith("owner@monetra.dev");
  });

  it("falha com token inexistente", async () => {
    const userRepository = makeUserRepository();
    const tokenRepository = makeTokenRepository(null);

    const useCase = new ResetPasswordUseCase(userRepository, tokenRepository, passwordHasher);

    await expect(
      useCase.execute({ token: "missing-token", password: "NovaSenha123" }),
    ).rejects.toThrow(InvalidPasswordResetTokenError);

    expect(userRepository.updatePasswordHash).not.toHaveBeenCalled();
  });

  it("falha com token expirado e remove tokens do e-mail", async () => {
    const userRepository = makeUserRepository();
    const tokenRepository = makeTokenRepository({
      ...validToken,
      expiresAt: new Date(Date.now() - 1000),
    });

    const useCase = new ResetPasswordUseCase(userRepository, tokenRepository, passwordHasher);

    await expect(
      useCase.execute({ token: "valid-token", password: "NovaSenha123" }),
    ).rejects.toThrow(ExpiredPasswordResetTokenError);

    expect(tokenRepository.deleteAllForEmail).toHaveBeenCalledWith("owner@monetra.dev");
    expect(userRepository.updatePasswordHash).not.toHaveBeenCalled();
  });

  it("falha com senha fraca sem consumir token", async () => {
    const userRepository = makeUserRepository();
    const tokenRepository = makeTokenRepository(validToken);

    const useCase = new ResetPasswordUseCase(userRepository, tokenRepository, passwordHasher);

    await expect(useCase.execute({ token: "valid-token", password: "fraca" })).rejects.toThrow(
      WeakPasswordError,
    );

    expect(userRepository.updatePasswordHash).not.toHaveBeenCalled();
    expect(tokenRepository.deleteAllForEmail).not.toHaveBeenCalled();
  });
});
