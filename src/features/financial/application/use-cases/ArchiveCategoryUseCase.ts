import { CategoryInUseError } from "@/features/financial/domain/errors/CategoryInUseError";
import { CategoryNotFoundError } from "@/features/financial/domain/errors/CategoryNotFoundError";
import type { ICategoryRepository } from "@/features/financial/domain/repositories/ICategoryRepository";
import { DefaultCategoryArchiveNotAllowedError } from "@/features/financial/domain/errors/DefaultCategoryArchiveNotAllowedError";
import type { AuthContext } from "@/features/identity/application/authorize";
import { authorizeOrThrow } from "@/features/identity/application/authorize";

type ArchiveCategoryInput = {
  id: string;
};

export class ArchiveCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: ArchiveCategoryInput, authContext: AuthContext): Promise<void> {
    authorizeOrThrow(authContext.role, "category:manage");

    const category = await this.categoryRepository.findById(input.id, authContext.organizationId);
    if (!category) {
      throw new CategoryNotFoundError();
    }

    if (category.isDefault()) {
      throw new DefaultCategoryArchiveNotAllowedError();
    }

    const inUse = await this.categoryRepository.isInUse(input.id);
    if (inUse) {
      throw new CategoryInUseError();
    }

    category.archive();
    await this.categoryRepository.save(category);
  }
}
