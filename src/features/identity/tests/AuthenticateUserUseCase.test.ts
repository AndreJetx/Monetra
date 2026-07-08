import { describe, expect, it, vi } from "vitest";
import { AuthenticateUserUseCase } from "@/features/identity/application/use-cases/AuthenticateUserUseCase";
import { InvalidCredentialsError } from "@/features/identity/domain/errors/InvalidCredentialsError";
import type { IUserRepository } from "@/features/identity/domain/repositories/IUserRepository";
import type { IPasswordHasher } from "@/features/identity/application/ports/IPasswordHasher";

describe("AuthenticateUserUseCase", () => {
  it("retorna usuário autenticado para credenciais válidas", async () => {
    const userRepository: IUserRepository = {
      existsByEmail: vi.fn(),
      findByEmail: vi.fn().mockResolvedValue({
        id: "user-1",
        name: "Owner",
        email: "owner@monetra.dev",
        image: null,
        passwordHash: "hashed-password",
        activeOrganizationId: "org-1",
      }),
    };

    const passwordHasher: IPasswordHasher = {
      hash: vi.fn(),
      compare: vi.fn().mockResolvedValue(true),
    };

    const useCase = new AuthenticateUserUseCase(userRepository, passwordHasher);
    const result = await useCase.execute({
      email: "OWNER@MONETRA.DEV",
      password: "Monetra123",
    });

    expect(result.email).toBe("owner@monetra.dev");
    expect(result.activeOrganizationId).toBe("org-1");
  });

  it("falha quando credenciais são inválidas", async () => {
    const userRepository: IUserRepository = {
      existsByEmail: vi.fn(),
      findByEmail: vi.fn().mockResolvedValue({
        id: "user-1",
        name: "Owner",
        email: "owner@monetra.dev",
        image: null,
        passwordHash: "hashed-password",
      }),
    };

    const passwordHasher: IPasswordHasher = {
      hash: vi.fn(),
      compare: vi.fn().mockResolvedValue(false),
    };

    const useCase = new AuthenticateUserUseCase(userRepository, passwordHasher);

    await expect(
      useCase.execute({
        email: "owner@monetra.dev",
        password: "wrong-password",
      }),
    ).rejects.toThrow(InvalidCredentialsError);
  });
});
