import type { IDefaultCategoriesProvisioner } from "@/features/financial/application/ports/IDefaultCategoriesProvisioner";
import type { ProvisionDefaultCategoriesUseCase } from "@/features/financial/application/use-cases/ProvisionDefaultCategoriesUseCase";

export class DefaultCategoriesProvisioner implements IDefaultCategoriesProvisioner {
  constructor(
    private readonly provisionDefaultCategoriesUseCase: ProvisionDefaultCategoriesUseCase,
  ) {}

  async provision(organizationId: string): Promise<void> {
    await this.provisionDefaultCategoriesUseCase.execute(organizationId);
  }
}
