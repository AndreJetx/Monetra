import type { ICategoryRepository } from "@/features/financial/domain/repositories/ICategoryRepository";
import type { CategoryType } from "@/features/financial/shared/types/CategoryType";
import type { AuthContext } from "@/features/identity/application/authorize";

export class ListCategoriesUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(authContext: AuthContext, type?: CategoryType) {
    return this.categoryRepository.listByOrganization(authContext.organizationId, type);
  }
}
