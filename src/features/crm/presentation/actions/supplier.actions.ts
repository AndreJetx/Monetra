"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/shared/auth/auth";
import { createAuthContext } from "@/features/identity/application/authorize";
import { InsufficientPermissionError } from "@/features/identity/domain/errors/InsufficientPermissionError";
import { SupplierNameAlreadyExistsError } from "@/features/crm/domain/errors/SupplierNameAlreadyExistsError";
import { InvalidSupplierNameError } from "@/features/crm/domain/errors/InvalidSupplierNameError";
import { createCreateSupplierUseCase } from "@/features/crm/infrastructure/factories";
import { CreateSupplierSchema } from "@/features/crm/shared/schemas/CreateSupplierSchema";

export type SupplierActionState = {
  success?: boolean;
  error?: string;
};

export async function createSupplierAction(
  _prevState: SupplierActionState,
  formData: FormData,
): Promise<SupplierActionState> {
  const session = await auth();
  const authContext = createAuthContext(session);

  if (!authContext) {
    return { error: "Usuario nao autenticado" };
  }

  const parsed = CreateSupplierSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email") || undefined,
    phone: formData.get("phone") || undefined,
    document: formData.get("document") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados invalidos" };
  }

  try {
    await createCreateSupplierUseCase().execute(parsed.data, authContext);
    revalidatePath("/suppliers");
    revalidatePath("/expenses");
    return { success: true };
  } catch (error) {
    if (error instanceof InsufficientPermissionError) {
      return { error: "Voce nao possui permissao para cadastrar fornecedores" };
    }

    if (
      error instanceof SupplierNameAlreadyExistsError ||
      error instanceof InvalidSupplierNameError
    ) {
      return { error: error.message };
    }

    throw error;
  }
}
