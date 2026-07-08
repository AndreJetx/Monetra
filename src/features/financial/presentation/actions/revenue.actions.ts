"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/shared/auth/auth";
import { createAuthContext } from "@/features/identity/application/authorize";
import { InsufficientPermissionError } from "@/features/identity/domain/errors/InsufficientPermissionError";
import {
  createConfirmRevenueReceiptUseCase,
  createCreateRevenueUseCase,
} from "@/features/financial/infrastructure/factories";
import { CreateRevenueSchema } from "@/features/financial/shared/schemas/CreateRevenueSchema";
import { ConfirmRevenueReceiptSchema } from "@/features/financial/shared/schemas/ConfirmRevenueReceiptSchema";
import { InvalidRevenueAmountError } from "@/features/financial/domain/errors/InvalidRevenueAmountError";
import { RevenueCategoryNotFoundError } from "@/features/financial/domain/errors/RevenueCategoryNotFoundError";
import { RevenueCategoryTypeMismatchError } from "@/features/financial/domain/errors/RevenueCategoryTypeMismatchError";
import { RevenueNotFoundError } from "@/features/financial/domain/errors/RevenueNotFoundError";
import { RevenueNotPendingError } from "@/features/financial/domain/errors/RevenueNotPendingError";
import { CustomerArchivedError } from "@/features/crm/domain/errors/CustomerArchivedError";
import { CustomerNotFoundError } from "@/features/crm/domain/errors/CustomerNotFoundError";

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
      error instanceof RevenueCategoryTypeMismatchError ||
      error instanceof CustomerNotFoundError ||
      error instanceof CustomerArchivedError
    ) {
      return { error: error.message };
    }

    throw error;
  }
}

export async function confirmRevenueReceiptAction(
  _prevState: RevenueActionState,
  formData: FormData,
): Promise<RevenueActionState> {
  const session = await auth();
  const authContext = createAuthContext(session);

  if (!authContext) {
    return { error: "Usuario nao autenticado" };
  }

  const parsed = ConfirmRevenueReceiptSchema.safeParse({
    id: formData.get("id"),
    receivedAt: formData.get("receivedAt") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados invalidos" };
  }

  try {
    await createConfirmRevenueReceiptUseCase().execute(parsed.data, authContext);
    revalidatePath("/revenues");
    return { success: true };
  } catch (error) {
    if (error instanceof InsufficientPermissionError) {
      return { error: "Voce nao possui permissao para confirmar recebimento" };
    }

    if (error instanceof RevenueNotFoundError || error instanceof RevenueNotPendingError) {
      return { error: error.message };
    }

    throw error;
  }
}
