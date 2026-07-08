import { Revenue } from "@/features/financial/domain/entities/Revenue";
import { RevenueCategoryNotFoundError } from "@/features/financial/domain/errors/RevenueCategoryNotFoundError";
import { RevenueCategoryTypeMismatchError } from "@/features/financial/domain/errors/RevenueCategoryTypeMismatchError";
import type { ICategoryRepository } from "@/features/financial/domain/repositories/ICategoryRepository";
import type { IRevenueRepository } from "@/features/financial/domain/repositories/IRevenueRepository";
import type { ICustomerRepository } from "@/features/crm/domain/repositories/ICustomerRepository";
import { CustomerArchivedError } from "@/features/crm/domain/errors/CustomerArchivedError";
import { CustomerNotFoundError } from "@/features/crm/domain/errors/CustomerNotFoundError";
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
    private readonly customerRepository: ICustomerRepository,
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

    if (input.customerId) {
      const customer = await this.customerRepository.findById(
        input.customerId,
        authContext.organizationId,
      );

      if (!customer) {
        throw new CustomerNotFoundError();
      }

      if (customer.isArchived()) {
        throw new CustomerArchivedError();
      }
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
