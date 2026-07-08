import { Category } from "@/features/financial/domain/entities/Category";
import type { CategoryType } from "@/features/financial/shared/types/CategoryType";

export class CategoryMapper {
  static toDomain(record: {
    id: string;
    organizationId: string;
    name: string;
    type: CategoryType;
    isDefault: boolean;
    archivedAt: Date | null;
    createdAt: Date;
  }): Category {
    return Category.create({
      id: record.id,
      organizationId: record.organizationId,
      name: record.name,
      type: record.type,
      isDefault: record.isDefault,
      archivedAt: record.archivedAt,
      createdAt: record.createdAt,
    });
  }

  static toPrisma(category: Category) {
    const data = category.toPrimitives();

    return {
      id: data.id,
      organizationId: data.organizationId,
      name: data.name,
      type: data.type,
      isDefault: data.isDefault,
      archivedAt: data.archivedAt,
      createdAt: data.createdAt,
    };
  }
}
