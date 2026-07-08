"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/shared/auth/auth";
import { createAuthContext } from "@/features/identity/application/authorize";
import { InsufficientPermissionError } from "@/features/identity/domain/errors/InsufficientPermissionError";
import { createCreateRevenueUseCase } from "@/features/financial/infrastructure/factories";
import { CreateRevenueSchema } from "@/features/financial/shared/schemas/CreateRevenueSchema";
import { InvalidRevenueAmountError } from "@/features/financial/domain/errors/InvalidRevenueAmountError";
import { RevenueCategoryNotFoundError } from "@/features/financial/domain/errors/RevenueCategoryNotFoundError";
import { RevenueCategoryTypeMismatchError } from "@/features/financial/domain/errors/RevenueCategoryTypeMismatchError";

export type RevenueActionState = {
  success?: boolean;
  error?: string;
};

export async function createRevenueAction(
  _prevState: RevenueActionState,
  formData: FormData,
): Promise<RevenueActionState> {
  const session = await auth();
  const authContext = createAuthContext(session);

  if (!authContext) {
    return { error: "Usuario nao autenticado" };
  }

  const parsed = CreateRevenueSchema.safeParse({
    amount: formData.get("amount"),
    categoryId: formData.get("categoryId"),
    dueDate: formData.get("dueDate"),
    customerId: formData.get("customerId") || undefined,
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados invalidos" };
  }

  try {
    await createCreateRevenueUseCase().execute(parsed.data, authContext);
    revalidatePath("/revenues");
    return { success: true };
  } catch (error) {
    if (error instanceof InsufficientPermissionError) {
      return { error: "Voce nao possui permissao para cadastrar receitas" };
    }

    if (
      error instanceof InvalidRevenueAmountError ||
      error instanceof RevenueCategoryNotFoundError ||
      error instanceof RevenueCategoryTypeMismatchError
    ) {
      return { error: error.message };
    }

    throw error;
  }
}
