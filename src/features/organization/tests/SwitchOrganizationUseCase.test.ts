import { describe, expect, it, vi } from "vitest";
import { SwitchOrganizationUseCase } from "@/features/organization/application/use-cases/SwitchOrganizationUseCase";
import { OrganizationAccessDeniedError } from "@/features/organization/domain/errors/OrganizationAccessDeniedError";
import type { IMembershipRepository } from "@/features/organization/domain/repositories/IMembershipRepository";

describe("SwitchOrganizationUseCase", () => {
  it("permite troca quando usuário pertence à organização", async () => {
    const membershipRepository: IMembershipRepository = {
      hasMembership: vi.fn().mockResolvedValue(true),
      listUserOrganizations: vi.fn(),
    };

    const useCase = new SwitchOrganizationUseCase(membershipRepository);

    const result = await useCase.execute({
      userId: "user-1",
      organizationId: "org-1",
    });

    expect(result.activeOrganizationId).toBe("org-1");
  });

  it("falha quando usuário não pertence à organização", async () => {
    const membershipRepository: IMembershipRepository = {
      hasMembership: vi.fn().mockResolvedValue(false),
      listUserOrganizations: vi.fn(),
    };

    const useCase = new SwitchOrganizationUseCase(membershipRepository);

    await expect(
      useCase.execute({
        userId: "user-1",
        organizationId: "org-2",
      }),
    ).rejects.toThrow(OrganizationAccessDeniedError);
  });
});
