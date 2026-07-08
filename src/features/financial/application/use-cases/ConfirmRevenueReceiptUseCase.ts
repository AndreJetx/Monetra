import type { AuthContext } from "@/features/identity/application/authorize";
import { authorizeOrThrow } from "@/features/identity/application/authorize";
import type { IRevenueRepository } from "@/features/financial/domain/repositories/IRevenueRepository";
import { RevenueNotFoundError } from "@/features/financial/domain/errors/RevenueNotFoundError";

type ConfirmRevenueReceiptInput = {
  id: string;
  receivedAt?: Date;
};

export class ConfirmRevenueReceiptUseCase {
  constructor(private readonly revenueRepository: IRevenueRepository) {}

  async execute(input: ConfirmRevenueReceiptInput, authContext: AuthContext) {
    authorizeOrThrow(authContext.role, "revenue:edit");

    const revenue = await this.revenueRepository.findById(input.id, authContext.organizationId);

    if (!revenue) {
      throw new RevenueNotFoundError();
    }

    revenue.confirmReceipt(input.receivedAt);
    return this.revenueRepository.update(revenue);
  }
}
