import { describe, expect, it, vi } from "vitest";
import { RegisterUserUseCase } from "@/features/identity/application/use-cases/RegisterUserUseCase";
import { EmailAlreadyInUseError } from "@/features/identity/domain/errors/EmailAlreadyInUseError";
import type { IUserRepository } from "@/features/identity/domain/repositories/IUserRepository";
import type { IPasswordHasher } from "@/features/identity/application/ports/IPasswordHasher";
import type { IAccountProvisioningGateway } from "@/features/identity/application/ports/IAccountProvisioningGateway";

describe("RegisterUserUseCase", () => {
  const baseInput = {
    name: "Owner",
    email: "owner@monetra.dev",
    password: "Monetra123",
    organizationName: "Monetra Demo",
  };

  it("provisiona owner quando dados são válidos", async () => {
    const userRepository: IUserRepository = {
      existsByEmail: vi.fn().mockResolvedValue(false),
      findByEmail: vi.fn(),
      updatePasswordHash: vi.fn(),
    };

    const passwordHasher: IPasswordHasher = {
      hash: vi.fn().mockResolvedValue("hashed-password"),
      compare: vi.fn(),
    };

    const accountProvisioningGateway: IAccountProvisioningGateway = {
      provisionOwner: vi.fn().mockResolvedValue(undefined),
    };

    const useCase = new RegisterUserUseCase(
      userRepository,
      passwordHasher,
      accountProvisioningGateway,
    );

    await useCase.execute(baseInput);

    expect(userRepository.existsByEmail).toHaveBeenCalledWith("owner@monetra.dev");
    expect(passwordHasher.hash).toHaveBeenCalledWith("Monetra123");
    expect(accountProvisioningGateway.provisionOwner).toHaveBeenCalledWith({
      name: "Owner",
      email: "owner@monetra.dev",
      passwordHash: "hashed-password",
      organizationName: "Monetra Demo",
    });
  });

  it("falha quando e-mail já está em uso", async () => {
    const userRepository: IUserRepository = {
      existsByEmail: vi.fn().mockResolvedValue(true),
      findByEmail: vi.fn(),
      updatePasswordHash: vi.fn(),
    };

    const passwordHasher: IPasswordHasher = {
      hash: vi.fn(),
      compare: vi.fn(),
    };

    const accountProvisioningGateway: IAccountProvisioningGateway = {
      provisionOwner: vi.fn(),
    };

    const useCase = new RegisterUserUseCase(
      userRepository,
      passwordHasher,
      accountProvisioningGateway,
    );

    await expect(useCase.execute(baseInput)).rejects.toThrow(EmailAlreadyInUseError);
  });
});
