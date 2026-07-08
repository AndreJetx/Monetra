import type { IRevenueRepository } from "@/features/financial/domain/repositories/IRevenueRepository";
import type { AuthContext } from "@/features/identity/application/authorize";

export class ListRevenuesUseCase {
  constructor(private readonly revenueRepository: IRevenueRepository) {}

  async execute(authContext: AuthContext) {
    return this.revenueRepository.listByOrganization(authContext.organizationId);
  }
}
