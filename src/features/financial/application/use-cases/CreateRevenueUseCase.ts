import { Revenue } from "@/features/financial/domain/entities/Revenue";
import { RevenueCategoryNotFoundError } from "@/features/financial/domain/errors/RevenueCategoryNotFoundError";
import { RevenueCategoryTypeMismatchError } from "@/features/financial/domain/errors/RevenueCategoryTypeMismatchError";
import type { ICategoryRepository } from "@/features/financial/domain/repositories/ICategoryRepository";
import type { IRevenueRepository } from "@/features/financial/domain/repositories/IRevenueRepository";
import type { AuthContext } from "@/features/identity/application/authorize";
import { authorizeOrThrow } from "@/features/identity/application/authorize";
import { CategoryType } from "@/features/financial/shared/types/CategoryType";

type CreateRevenueInput = {
  amount: number;
  categoryId: string;
  dueDate: Date;
  customerId?: string;
  description?: string;
};

export class CreateRevenueUseCase {
  constructor(
    private readonly revenueRepository: IRevenueRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(input: CreateRevenueInput, authContext: AuthContext): Promise<Revenue> {
    authorizeOrThrow(authContext.role, "revenue:create");

    const category = await this.categoryRepository.findById(
      input.categoryId,
      authContext.organizationId,
    );

    if (!category) {
      throw new RevenueCategoryNotFoundError();
    }

    if (category.getType() !== CategoryType.REVENUE) {
      throw new RevenueCategoryTypeMismatchError();
    }

    const revenue = Revenue.create({
      organizationId: authContext.organizationId,
      amount: input.amount,
      description: input.description,
      dueDate: input.dueDate,
      categoryId: input.categoryId,
      customerId: input.customerId,
      createdBy: authContext.userId,
    });

    return this.revenueRepository.save(revenue);
  }
}
