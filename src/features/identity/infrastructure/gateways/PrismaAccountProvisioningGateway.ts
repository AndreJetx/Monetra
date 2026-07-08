import type { PrismaClient } from "@prisma/client";
import type { IAccountProvisioningGateway } from "@/features/identity/application/ports/IAccountProvisioningGateway";
import type { IDefaultCategoriesProvisioner } from "@/features/financial/application/ports/IDefaultCategoriesProvisioner";

type ProvisionOwnerInput = {
  name: string;
  email: string;
  passwordHash: string;
  organizationName: string;
};

export class PrismaAccountProvisioningGateway implements IAccountProvisioningGateway {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly defaultCategoriesProvisioner: IDefaultCategoriesProvisioner,
  ) {}

  async provisionOwner(input: ProvisionOwnerInput): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: input.organizationName,
          currency: "BRL",
          timezone: "America/Sao_Paulo",
        },
      });

      const user = await tx.user.create({
        data: {
          name: input.name,
          email: input.email,
          passwordHash: input.passwordHash,
        },
      });

      await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: "OWNER",
        },
      });

      await this.defaultCategoriesProvisioner.provision(organization.id);
    });
  }
}
