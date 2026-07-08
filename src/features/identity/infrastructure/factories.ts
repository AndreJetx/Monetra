import { RegisterUserUseCase } from "@/features/identity/application/use-cases/RegisterUserUseCase";
import { AuthenticateUserUseCase } from "@/features/identity/application/use-cases/AuthenticateUserUseCase";
import { ForgotPasswordUseCase } from "@/features/identity/application/use-cases/ForgotPasswordUseCase";
import { ResetPasswordUseCase } from "@/features/identity/application/use-cases/ResetPasswordUseCase";
import { PrismaUserRepository } from "@/features/identity/infrastructure/repositories/PrismaUserRepository";
import { PrismaPasswordResetTokenRepository } from "@/features/identity/infrastructure/repositories/PrismaPasswordResetTokenRepository";
import { PrismaAccountProvisioningGateway } from "@/features/identity/infrastructure/gateways/PrismaAccountProvisioningGateway";
import { BcryptPasswordHasher } from "@/features/identity/infrastructure/security/BcryptPasswordHasher";
import { CryptoTokenGenerator } from "@/features/identity/infrastructure/security/CryptoTokenGenerator";
import { ConsolePasswordResetMailer } from "@/features/identity/infrastructure/mail/ConsolePasswordResetMailer";
import { PrismaMembershipRepository } from "@/features/organization/infrastructure/repositories/PrismaMembershipRepository";
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
  const userMembershipReader = new PrismaMembershipRepository(prisma);

  return new AuthenticateUserUseCase(userRepository, passwordHasher, userMembershipReader);
}

export function createForgotPasswordUseCase(): ForgotPasswordUseCase {
  const userRepository = new PrismaUserRepository(prisma);
  const tokenRepository = new PrismaPasswordResetTokenRepository(prisma);
  const tokenGenerator = new CryptoTokenGenerator();
  const mailer = new ConsolePasswordResetMailer();

  return new ForgotPasswordUseCase(userRepository, tokenRepository, tokenGenerator, mailer);
}

export function createResetPasswordUseCase(): ResetPasswordUseCase {
  const userRepository = new PrismaUserRepository(prisma);
  const tokenRepository = new PrismaPasswordResetTokenRepository(prisma);
  const passwordHasher = new BcryptPasswordHasher();

  return new ResetPasswordUseCase(userRepository, tokenRepository, passwordHasher);
}
