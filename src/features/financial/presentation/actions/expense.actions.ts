"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/shared/auth/auth";
import { createAuthContext } from "@/features/identity/application/authorize";
import { InsufficientPermissionError } from "@/features/identity/domain/errors/InsufficientPermissionError";
import { createCreateExpenseUseCase } from "@/features/financial/infrastructure/factories";
import { CreateExpenseSchema } from "@/features/financial/shared/schemas/CreateExpenseSchema";
import { InvalidExpenseAmountError } from "@/features/financial/domain/errors/InvalidExpenseAmountError";
import { ExpenseCategoryNotFoundError } from "@/features/financial/domain/errors/ExpenseCategoryNotFoundError";
import { ExpenseCategoryTypeMismatchError } from "@/features/financial/domain/errors/ExpenseCategoryTypeMismatchError";

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
      error instanceof ExpenseCategoryTypeMismatchError
    ) {
      return { error: error.message };
    }

    throw error;
  }
}
