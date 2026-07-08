"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/shared/auth/auth";
import { createAuthContext } from "@/features/identity/application/authorize";
import { InsufficientPermissionError } from "@/features/identity/domain/errors/InsufficientPermissionError";
import {
  createConfirmExpensePaymentUseCase,
  createCreateExpenseUseCase,
} from "@/features/financial/infrastructure/factories";
import { CreateExpenseSchema } from "@/features/financial/shared/schemas/CreateExpenseSchema";
import { ConfirmExpensePaymentSchema } from "@/features/financial/shared/schemas/ConfirmExpensePaymentSchema";
import { InvalidExpenseAmountError } from "@/features/financial/domain/errors/InvalidExpenseAmountError";
import { ExpenseCategoryNotFoundError } from "@/features/financial/domain/errors/ExpenseCategoryNotFoundError";
import { ExpenseCategoryTypeMismatchError } from "@/features/financial/domain/errors/ExpenseCategoryTypeMismatchError";
import { SupplierArchivedError } from "@/features/crm/domain/errors/SupplierArchivedError";
import { SupplierNotFoundError } from "@/features/crm/domain/errors/SupplierNotFoundError";
import { ExpenseNotFoundError } from "@/features/financial/domain/errors/ExpenseNotFoundError";
import { ExpenseNotPendingError } from "@/features/financial/domain/errors/ExpenseNotPendingError";

export type ExpenseActionState = {
  success?: boolean;
  error?: string;
};

export async function createExpenseAction(
  _prevState: ExpenseActionState,
  formData: FormData,
): Promise<ExpenseActionState> {
  const session = await auth();
  const authContext = createAuthContext(session);

  if (!authContext) {
    return { error: "Usuario nao autenticado" };
  }

  const parsed = CreateExpenseSchema.safeParse({
    amount: formData.get("amount"),
    categoryId: formData.get("categoryId"),
    dueDate: formData.get("dueDate"),
    supplierId: formData.get("supplierId") || undefined,
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados invalidos" };
  }

  try {
    await createCreateExpenseUseCase().execute(parsed.data, authContext);
    revalidatePath("/expenses");
    return { success: true };
  } catch (error) {
    if (error instanceof InsufficientPermissionError) {
      return { error: "Voce nao possui permissao para cadastrar despesas" };
    }

    if (
      error instanceof InvalidExpenseAmountError ||
      error instanceof ExpenseCategoryNotFoundError ||
      error instanceof ExpenseCategoryTypeMismatchError ||
      error instanceof SupplierNotFoundError ||
      error instanceof SupplierArchivedError
    ) {
      return { error: error.message };
    }

    throw error;
  }
}

export async function confirmExpensePaymentAction(
  _prevState: ExpenseActionState,
  formData: FormData,
): Promise<ExpenseActionState> {
  const session = await auth();
  const authContext = createAuthContext(session);

  if (!authContext) {
    return { error: "Usuario nao autenticado" };
  }

  const parsed = ConfirmExpensePaymentSchema.safeParse({
    id: formData.get("id"),
    paidAt: formData.get("paidAt") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados invalidos" };
  }

  try {
    await createConfirmExpensePaymentUseCase().execute(parsed.data, authContext);
    revalidatePath("/expenses");
    return { success: true };
  } catch (error) {
    if (error instanceof InsufficientPermissionError) {
      return { error: "Voce nao possui permissao para confirmar pagamento" };
    }

    if (error instanceof ExpenseNotFoundError || error instanceof ExpenseNotPendingError) {
      return { error: error.message };
    }

    throw error;
  }
}
