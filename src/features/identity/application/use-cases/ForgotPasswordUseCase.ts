import { Email } from "@/features/identity/domain/value-objects/Email";
import type { IUserRepository } from "@/features/identity/domain/repositories/IUserRepository";
import type { IPasswordResetTokenRepository } from "@/features/identity/domain/repositories/IPasswordResetTokenRepository";
import type { IPasswordResetMailer } from "@/features/identity/application/ports/IPasswordResetMailer";
import type { ITokenGenerator } from "@/features/identity/application/ports/ITokenGenerator";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

type ForgotPasswordInput = {
  email: string;
};

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenRepository: IPasswordResetTokenRepository,
    private readonly tokenGenerator: ITokenGenerator,
    private readonly mailer: IPasswordResetMailer,
  ) {}

  async execute(input: ForgotPasswordInput): Promise<void> {
    const email = Email.create(input.email).value();
    const user = await this.userRepository.findByEmail(email);

    // RN-IDENTITY-004: resposta genérica — não revelar se o e-mail existe.
    if (!user) return;

    const token = this.tokenGenerator.generate();

    await this.tokenRepository.deleteAllForEmail(email);
    await this.tokenRepository.create({
      email,
      token,
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    });

    await this.mailer.sendPasswordResetEmail(email, token);
  }
}
