import { prisma } from "@/shared/db/prisma";
import { SwitchOrganizationUseCase } from "@/features/organization/application/use-cases/SwitchOrganizationUseCase";
import { ListUserOrganizationsUseCase } from "@/features/organization/application/use-cases/ListUserOrganizationsUseCase";
import { PrismaMembershipRepository } from "@/features/organization/infrastructure/repositories/PrismaMembershipRepository";

export function createSwitchOrganizationUseCase(): SwitchOrganizationUseCase {
  const membershipRepository = new PrismaMembershipRepository(prisma);
  return new SwitchOrganizationUseCase(membershipRepository);
}

export function createListUserOrganizationsUseCase(): ListUserOrganizationsUseCase {
  const membershipRepository = new PrismaMembershipRepository(prisma);
  return new ListUserOrganizationsUseCase(membershipRepository);
}
