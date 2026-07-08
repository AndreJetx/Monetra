import { Password } from "@/features/identity/domain/value-objects/Password";
import { InvalidPasswordResetTokenError } from "@/features/identity/domain/errors/InvalidPasswordResetTokenError";
import { ExpiredPasswordResetTokenError } from "@/features/identity/domain/errors/ExpiredPasswordResetTokenError";
import type { IUserRepository } from "@/features/identity/domain/repositories/IUserRepository";
import type { IPasswordResetTokenRepository } from "@/features/identity/domain/repositories/IPasswordResetTokenRepository";
import type { IPasswordHasher } from "@/features/identity/application/ports/IPasswordHasher";

type ResetPasswordInput = {
  token: string;
  password: string;
};

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenRepository: IPasswordResetTokenRepository,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(input: ResetPasswordInput): Promise<void> {
    const resetToken = await this.tokenRepository.findByToken(input.token);

    if (!resetToken) {
      throw new InvalidPasswordResetTokenError();
    }

    if (resetToken.expiresAt.getTime() < Date.now()) {
      await this.tokenRepository.deleteAllForEmail(resetToken.email);
      throw new ExpiredPasswordResetTokenError();
    }

    const user = await this.userRepository.findByEmail(resetToken.email);
    if (!user) {
      throw new InvalidPasswordResetTokenError();
    }

    const password = Password.create(input.password);
    const passwordHash = await this.passwordHasher.hash(password.value());

    await this.userRepository.updatePasswordHash(user.id, passwordHash);

    // RN-IDENTITY-004: token de uso único.
    await this.tokenRepository.deleteAllForEmail(resetToken.email);
  }
}
