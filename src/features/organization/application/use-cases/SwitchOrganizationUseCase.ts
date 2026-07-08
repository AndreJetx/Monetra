import { OrganizationAccessDeniedError } from "@/features/organization/domain/errors/OrganizationAccessDeniedError";
import type { IMembershipRepository } from "@/features/organization/domain/repositories/IMembershipRepository";
import type { Role } from "@/features/identity/shared/types/Role";

type SwitchOrganizationInput = {
  userId: string;
  organizationId: string;
};

type SwitchOrganizationOutput = {
  activeOrganizationId: string;
  role: Role;
};

export class SwitchOrganizationUseCase {
  constructor(private readonly membershipRepository: IMembershipRepository) {}

  async execute(input: SwitchOrganizationInput): Promise<SwitchOrganizationOutput> {
    const hasAccess = await this.membershipRepository.hasMembership(
      input.userId,
      input.organizationId,
    );

    if (!hasAccess) {
      throw new OrganizationAccessDeniedError();
    }

    const role = await this.membershipRepository.getMembershipRole(
      input.userId,
      input.organizationId,
    );

    if (!role) {
      throw new OrganizationAccessDeniedError();
    }

    return { activeOrganizationId: input.organizationId, role };
  }
}
