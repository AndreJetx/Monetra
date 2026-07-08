"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/shared/auth/auth";
import { createAuthContext } from "@/features/identity/application/authorize";
import { InsufficientPermissionError } from "@/features/identity/domain/errors/InsufficientPermissionError";
import { CustomerNameAlreadyExistsError } from "@/features/crm/domain/errors/CustomerNameAlreadyExistsError";
import { InvalidCustomerNameError } from "@/features/crm/domain/errors/InvalidCustomerNameError";
import { createCreateCustomerUseCase } from "@/features/crm/infrastructure/factories";
import { CreateCustomerSchema } from "@/features/crm/shared/schemas/CreateCustomerSchema";

export type CustomerActionState = {
  success?: boolean;
  error?: string;
};

export async function createCustomerAction(
  _prevState: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const session = await auth();
  const authContext = createAuthContext(session);

  if (!authContext) {
    return { error: "Usuario nao autenticado" };
  }

  const parsed = CreateCustomerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email") || undefined,
    phone: formData.get("phone") || undefined,
    document: formData.get("document") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados invalidos" };
  }

  try {
    await createCreateCustomerUseCase().execute(parsed.data, authContext);
    revalidatePath("/customers");
    revalidatePath("/revenues");
    return { success: true };
  } catch (error) {
    if (error instanceof InsufficientPermissionError) {
      return { error: "Voce nao possui permissao para cadastrar clientes" };
    }

    if (
      error instanceof CustomerNameAlreadyExistsError ||
      error instanceof InvalidCustomerNameError
    ) {
      return { error: error.message };
    }

    throw error;
  }
}
