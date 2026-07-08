import { OrganizationAccessDeniedError } from "@/features/organization/domain/errors/OrganizationAccessDeniedError";
import type { IMembershipRepository } from "@/features/organization/domain/repositories/IMembershipRepository";

type SwitchOrganizationInput = {
  userId: string;
  organizationId: string;
};

type SwitchOrganizationOutput = {
  activeOrganizationId: string;
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

    return { activeOrganizationId: input.organizationId };
  }
}
