import { RegisterUserUseCase } from "@/features/identity/application/use-cases/RegisterUserUseCase";
import { AuthenticateUserUseCase } from "@/features/identity/application/use-cases/AuthenticateUserUseCase";
import { PrismaUserRepository } from "@/features/identity/infrastructure/repositories/PrismaUserRepository";
import { PrismaAccountProvisioningGateway } from "@/features/identity/infrastructure/gateways/PrismaAccountProvisioningGateway";
import { BcryptPasswordHasher } from "@/features/identity/infrastructure/security/BcryptPasswordHasher";
import { prisma } from "@/shared/db/prisma";

export function createRegisterUserUseCase(): RegisterUserUseCase {
  const userRepository = new PrismaUserRepository(prisma);
  const passwordHasher = new BcryptPasswordHasher();
  const accountProvisioningGateway = new PrismaAccountProvisioningGateway(prisma);

  return new RegisterUserUseCase(userRepository, passwordHasher, accountProvisioningGateway);
}

export function createAuthenticateUserUseCase(): AuthenticateUserUseCase {
  const userRepository = new PrismaUserRepository(prisma);
  const passwordHasher = new BcryptPasswordHasher();

  return new AuthenticateUserUseCase(userRepository, passwordHasher);
}
