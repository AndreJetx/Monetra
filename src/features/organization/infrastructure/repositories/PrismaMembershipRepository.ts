import type { PrismaClient } from "@prisma/client";
import type { Role } from "@/features/identity/shared/types/Role";
import type {
  IMembershipRepository,
  UserOrganization,
} from "@/features/organization/domain/repositories/IMembershipRepository";

export class PrismaMembershipRepository implements IMembershipRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async hasMembership(userId: string, organizationId: string): Promise<boolean> {
    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
      select: { id: true },
    });

    return !!membership;
  }

  async getMembershipRole(userId: string, organizationId: string): Promise<Role | null> {
    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
      select: { role: true },
    });

    return membership?.role ?? null;
  }

  async listUserOrganizations(userId: string): Promise<UserOrganization[]> {
    const memberships = await this.prisma.membership.findMany({
      where: { userId },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return memberships.map((membership) => ({
      organizationId: membership.organization.id,
      organizationName: membership.organization.name,
    }));
  }
}
