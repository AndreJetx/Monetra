import type { CategoryType } from "@/features/financial/shared/types/CategoryType";
import type { Category } from "@/features/financial/domain/entities/Category";

export interface ICategoryRepository {
  save(category: Category): Promise<Category>;
  findById(id: string, organizationId: string): Promise<Category | null>;
  findByName(name: string, type: CategoryType, organizationId: string): Promise<Category | null>;
  listByOrganization(organizationId: string, type?: CategoryType): Promise<Category[]>;
  isInUse(categoryId: string): Promise<boolean>;
  createMany(categories: Category[]): Promise<void>;
}
