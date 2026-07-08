import type { Role } from "@/features/identity/shared/types/Role";

export interface IUserMembershipReader {
  getMembershipRole(userId: string, organizationId: string): Promise<Role | null>;
}
