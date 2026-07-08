import type {
  IMembershipRepository,
  UserOrganization,
} from "@/features/organization/domain/repositories/IMembershipRepository";

export class ListUserOrganizationsUseCase {
  constructor(private readonly membershipRepository: IMembershipRepository) {}

  async execute(userId: string): Promise<UserOrganization[]> {
    return this.membershipRepository.listUserOrganizations(userId);
  }
}
