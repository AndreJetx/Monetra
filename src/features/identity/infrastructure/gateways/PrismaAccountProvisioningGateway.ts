import type { PrismaClient } from "@prisma/client";
import type { IAccountProvisioningGateway } from "@/features/identity/application/ports/IAccountProvisioningGateway";

type ProvisionOwnerInput = {
  name: string;
  email: string;
  passwordHash: string;
  organizationName: string;
};

export class PrismaAccountProvisioningGateway implements IAccountProvisioningGateway {
  constructor(private readonly prisma: PrismaClient) {}

  async provisionOwner(input: ProvisionOwnerInput): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          name: input.name,
          email: input.email,
          passwordHash: input.passwordHash,
          memberships: {
            create: {
              role: "OWNER",
              organization: {
                create: {
                  name: input.organizationName,
                  currency: "BRL",
                  timezone: "America/Sao_Paulo",
                },
              },
            },
          },
        },
      });
    });
  }
}
