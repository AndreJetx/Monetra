export type UserOrganization = {
  organizationId: string;
  organizationName: string;
};

export interface IMembershipRepository {
  hasMembership(userId: string, organizationId: string): Promise<boolean>;
  getMembershipRole(
    userId: string,
    organizationId: string,
  ): Promise<import("@/features/identity/shared/types/Role").Role | null>;
  listUserOrganizations(userId: string): Promise<UserOrganization[]>;
}
