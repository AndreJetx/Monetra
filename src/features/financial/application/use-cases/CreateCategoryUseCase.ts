import { Category } from "@/features/financial/domain/entities/Category";
import { CategoryNameAlreadyExistsError } from "@/features/financial/domain/errors/CategoryNameAlreadyExistsError";
import type { ICategoryRepository } from "@/features/financial/domain/repositories/ICategoryRepository";
import type { CategoryType } from "@/features/financial/shared/types/CategoryType";
import type { AuthContext } from "@/features/identity/application/authorize";
import { authorizeOrThrow } from "@/features/identity/application/authorize";

type CreateCategoryInput = {
  name: string;
  type: CategoryType;
  isDefault?: boolean;
};

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: CreateCategoryInput, authContext: AuthContext): Promise<Category> {
    authorizeOrThrow(authContext.role, "category:manage");

    const existing = await this.categoryRepository.findByName(
      input.name,
      input.type,
      authContext.organizationId,
    );

    if (existing) {
      throw new CategoryNameAlreadyExistsError();
    }

    const category = Category.create({
      organizationId: authContext.organizationId,
      name: input.name,
      type: input.type,
      isDefault: input.isDefault ?? false,
    });

    return this.categoryRepository.save(category);
  }
}
