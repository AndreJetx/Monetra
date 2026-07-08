import type { PrismaClient } from "@prisma/client";
import type {
  IUserRepository,
  UserAuthRecord,
} from "@/features/identity/domain/repositories/IUserRepository";
import { UserMapper } from "@/features/identity/infrastructure/mappers/UserMapper";

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    return !!user;
  }

  async findByEmail(email: string): Promise<UserAuthRecord | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          take: 1,
          orderBy: { createdAt: "asc" },
          select: { organizationId: true },
        },
      },
    });

    if (!user) return null;
    return UserMapper.toAuthRecord(user);
  }

  async updatePasswordHash(userId: string, passwordHash: string): Promise<void> {
    // RN-IDENTITY-004: invalidar sessões anteriores após alteração de senha.
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      }),
      this.prisma.session.deleteMany({
        where: { userId },
      }),
    ]);
  }
}
