import { describe, expect, it, vi } from "vitest";
import { ForgotPasswordUseCase } from "@/features/identity/application/use-cases/ForgotPasswordUseCase";
import type { IUserRepository } from "@/features/identity/domain/repositories/IUserRepository";
import type { IPasswordResetTokenRepository } from "@/features/identity/domain/repositories/IPasswordResetTokenRepository";
import type { IPasswordResetMailer } from "@/features/identity/application/ports/IPasswordResetMailer";
import type { ITokenGenerator } from "@/features/identity/application/ports/ITokenGenerator";

function makeTokenRepository(): IPasswordResetTokenRepository {
  return {
    create: vi.fn(),
    findByToken: vi.fn(),
    deleteAllForEmail: vi.fn(),
  };
}

function makeUserRepository(user: unknown): IUserRepository {
  return {
    existsByEmail: vi.fn(),
    findByEmail: vi.fn().mockResolvedValue(user),
    updatePasswordHash: vi.fn(),
  };
}

const tokenGenerator: ITokenGenerator = {
  generate: vi.fn().mockReturnValue("generated-token"),
};

describe("ForgotPasswordUseCase", () => {
  it("gera token e envia e-mail quando usuário existe", async () => {
    const userRepository = makeUserRepository({
      id: "user-1",
      name: "Owner",
      email: "owner@monetra.dev",
      image: null,
      passwordHash: "hash",
    });
    const tokenRepository = makeTokenRepository();
    const mailer: IPasswordResetMailer = {
      sendPasswordResetEmail: vi.fn(),
    };

    const useCase = new ForgotPasswordUseCase(
      userRepository,
      tokenRepository,
      tokenGenerator,
      mailer,
    );

    await useCase.execute({ email: "OWNER@MONETRA.DEV" });

    expect(tokenRepository.deleteAllForEmail).toHaveBeenCalledWith("owner@monetra.dev");
    expect(tokenRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "owner@monetra.dev",
        token: "generated-token",
      }),
    );
    expect(mailer.sendPasswordResetEmail).toHaveBeenCalledWith(
      "owner@monetra.dev",
      "generated-token",
    );
  });

  it("cria token com expiração de 24 horas", async () => {
    const userRepository = makeUserRepository({
      id: "user-1",
      name: "Owner",
      email: "owner@monetra.dev",
      image: null,
      passwordHash: "hash",
    });
    const tokenRepository = makeTokenRepository();
    const mailer: IPasswordResetMailer = {
      sendPasswordResetEmail: vi.fn(),
    };

    const useCase = new ForgotPasswordUseCase(
      userRepository,
      tokenRepository,
      tokenGenerator,
      mailer,
    );

    const before = Date.now();
    await useCase.execute({ email: "owner@monetra.dev" });
    const after = Date.now();

    const createdToken = vi.mocked(tokenRepository.create).mock.calls[0][0];
    const ttl = 24 * 60 * 60 * 1000;
    expect(createdToken.expiresAt.getTime()).toBeGreaterThanOrEqual(before + ttl);
    expect(createdToken.expiresAt.getTime()).toBeLessThanOrEqual(after + ttl);
  });

  it("não envia e-mail nem falha quando usuário não existe", async () => {
    const userRepository = makeUserRepository(null);
    const tokenRepository = makeTokenRepository();
    const mailer: IPasswordResetMailer = {
      sendPasswordResetEmail: vi.fn(),
    };

    const useCase = new ForgotPasswordUseCase(
      userRepository,
      tokenRepository,
      tokenGenerator,
      mailer,
    );

    await expect(useCase.execute({ email: "unknown@monetra.dev" })).resolves.toBeUndefined();

    expect(tokenRepository.create).not.toHaveBeenCalled();
    expect(mailer.sendPasswordResetEmail).not.toHaveBeenCalled();
  });
});
