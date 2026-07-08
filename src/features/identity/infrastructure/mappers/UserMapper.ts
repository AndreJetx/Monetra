import type { UserAuthRecord } from "@/features/identity/domain/repositories/IUserRepository";

type PrismaUserWithMembership = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  passwordHash: string | null;
  memberships: Array<{ organizationId: string }>;
};

export class UserMapper {
  static toAuthRecord(prismaUser: PrismaUserWithMembership): UserAuthRecord {
    return {
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      image: prismaUser.image,
      passwordHash: prismaUser.passwordHash,
      activeOrganizationId: prismaUser.memberships[0]?.organizationId,
    };
  }
}
