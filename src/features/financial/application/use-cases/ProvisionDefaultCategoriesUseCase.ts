import { Category } from "@/features/financial/domain/entities/Category";
import type { ICategoryRepository } from "@/features/financial/domain/repositories/ICategoryRepository";
import { defaultCategories } from "@/features/financial/shared/constants/defaultCategories";

export class ProvisionDefaultCategoriesUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(organizationId: string): Promise<void> {
    const existing = await this.categoryRepository.listByOrganization(organizationId);
    if (existing.length > 0) {
      return;
    }

    const categories = defaultCategories.map((category) =>
      Category.create({
        organizationId,
        name: category.name,
        type: category.type,
        isDefault: true,
      }),
    );

    await this.categoryRepository.createMany(categories);
  }
}
