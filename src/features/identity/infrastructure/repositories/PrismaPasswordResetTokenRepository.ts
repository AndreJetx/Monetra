import type { PrismaClient } from "@prisma/client";
import type {
  IPasswordResetTokenRepository,
  PasswordResetToken,
} from "@/features/identity/domain/repositories/IPasswordResetTokenRepository";

export class PrismaPasswordResetTokenRepository implements IPasswordResetTokenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: PasswordResetToken): Promise<void> {
    await this.prisma.verificationToken.create({
      data: {
        identifier: data.email,
        token: data.token,
        expires: data.expiresAt,
      },
    });
  }

  async findByToken(token: string): Promise<PasswordResetToken | null> {
    const record = await this.prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!record) return null;

    return {
      email: record.identifier,
      token: record.token,
      expiresAt: record.expires,
    };
  }

  async deleteAllForEmail(email: string): Promise<void> {
    await this.prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });
  }
}
