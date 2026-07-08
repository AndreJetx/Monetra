import type { PrismaClient } from "@prisma/client";
import { CategoryMapper } from "@/features/financial/infrastructure/mappers/CategoryMapper";
import type { CategoryType } from "@/features/financial/shared/types/CategoryType";
import type { ICategoryRepository } from "@/features/financial/domain/repositories/ICategoryRepository";
import type { Category } from "@/features/financial/domain/entities/Category";

export class PrismaCategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(category: Category): Promise<Category> {
    const data = CategoryMapper.toPrisma(category);

    const saved = data.id
      ? await this.prisma.category.update({
          where: { id: data.id },
          data: {
            name: data.name,
            archivedAt: data.archivedAt,
          },
        })
      : await this.prisma.category.create({
          data: {
            organizationId: data.organizationId,
            name: data.name,
            type: data.type,
            isDefault: data.isDefault,
          },
        });

    return CategoryMapper.toDomain(saved);
  }

  async findById(id: string, organizationId: string): Promise<Category | null> {
    const category = await this.prisma.category.findFirst({
      where: { id, organizationId },
    });

    return category ? CategoryMapper.toDomain(category) : null;
  }

  async findByName(
    name: string,
    type: CategoryType,
    organizationId: string,
  ): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: {
        organizationId_name_type: {
          organizationId,
          name: name.trim(),
          type,
        },
      },
    });

    return category ? CategoryMapper.toDomain(category) : null;
  }

  async listByOrganization(organizationId: string, type?: CategoryType): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: {
        organizationId,
        type,
        archivedAt: null,
      },
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });

    return categories.map(CategoryMapper.toDomain);
  }

  async isInUse(categoryId: string): Promise<boolean> {
    // Sera ligado a Revenue/Expense quando US-FIN-001 e US-FIN-003 forem implementadas.
    void categoryId;
    return false;
  }

  async createMany(categories: Category[]): Promise<void> {
    await this.prisma.category.createMany({
      data: categories.map((category) => {
        const data = category.toPrimitives();
        return {
          organizationId: data.organizationId,
          name: data.name,
          type: data.type,
          isDefault: data.isDefault,
        };
      }),
      skipDuplicates: true,
    });
  }
}
