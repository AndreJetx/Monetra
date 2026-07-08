import { CategoryNameAlreadyExistsError } from "@/features/financial/domain/errors/CategoryNameAlreadyExistsError";
import { CategoryNotFoundError } from "@/features/financial/domain/errors/CategoryNotFoundError";
import type { ICategoryRepository } from "@/features/financial/domain/repositories/ICategoryRepository";
import type { AuthContext } from "@/features/identity/application/authorize";
import { authorizeOrThrow } from "@/features/identity/application/authorize";

type UpdateCategoryInput = {
  id: string;
  name: string;
};

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: UpdateCategoryInput, authContext: AuthContext) {
    authorizeOrThrow(authContext.role, "category:manage");

    const category = await this.categoryRepository.findById(input.id, authContext.organizationId);
    if (!category) {
      throw new CategoryNotFoundError();
    }

    const duplicate = await this.categoryRepository.findByName(
      input.name,
      category.getType(),
      authContext.organizationId,
    );

    if (duplicate && duplicate.getId() !== category.getId()) {
      throw new CategoryNameAlreadyExistsError();
    }

    category.rename(input.name);
    return this.categoryRepository.save(category);
  }
}
