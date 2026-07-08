"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/shared/auth/auth";
import { createAuthContext } from "@/features/identity/application/authorize";
import { InsufficientPermissionError } from "@/features/identity/domain/errors/InsufficientPermissionError";
import { CategoryInUseError } from "@/features/financial/domain/errors/CategoryInUseError";
import { CategoryNameAlreadyExistsError } from "@/features/financial/domain/errors/CategoryNameAlreadyExistsError";
import { CategoryNotFoundError } from "@/features/financial/domain/errors/CategoryNotFoundError";
import { DefaultCategoryArchiveNotAllowedError } from "@/features/financial/domain/errors/DefaultCategoryArchiveNotAllowedError";
import { InvalidCategoryNameError } from "@/features/financial/domain/errors/InvalidCategoryNameError";
import {
  createArchiveCategoryUseCase,
  createCreateCategoryUseCase,
  createUpdateCategoryUseCase,
} from "@/features/financial/infrastructure/factories";
import { CreateCategorySchema } from "@/features/financial/shared/schemas/CreateCategorySchema";
import { UpdateCategorySchema } from "@/features/financial/shared/schemas/UpdateCategorySchema";

export type CategoryActionState = {
  success?: boolean;
  error?: string;
};

const archiveCategorySchema = z.object({
  id: z.string().min(1, "Categoria invalida"),
});

export async function createCategoryAction(
  _prevState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const session = await auth();
  const authContext = createAuthContext(session);

  if (!authContext) {
    return { error: "Usuario nao autenticado" };
  }

  const parsed = CreateCategorySchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados invalidos" };
  }

  try {
    await createCreateCategoryUseCase().execute(parsed.data, authContext);
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    if (error instanceof InsufficientPermissionError) {
      return { error: "Voce nao possui permissao para gerenciar categorias" };
    }

    if (
      error instanceof CategoryNameAlreadyExistsError ||
      error instanceof InvalidCategoryNameError
    ) {
      return { error: error.message };
    }

    throw error;
  }
}

export async function updateCategoryAction(
  _prevState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const session = await auth();
  const authContext = createAuthContext(session);

  if (!authContext) {
    return { error: "Usuario nao autenticado" };
  }

  const parsed = UpdateCategorySchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados invalidos" };
  }

  try {
    await createUpdateCategoryUseCase().execute(parsed.data, authContext);
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    if (error instanceof InsufficientPermissionError) {
      return { error: "Voce nao possui permissao para gerenciar categorias" };
    }

    if (
      error instanceof CategoryNameAlreadyExistsError ||
      error instanceof InvalidCategoryNameError ||
      error instanceof CategoryNotFoundError
    ) {
      return { error: error.message };
    }

    throw error;
  }
}

export async function archiveCategoryAction(
  _prevState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const session = await auth();
  const authContext = createAuthContext(session);

  if (!authContext) {
    return { error: "Usuario nao autenticado" };
  }

  const parsed = archiveCategorySchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados invalidos" };
  }

  try {
    await createArchiveCategoryUseCase().execute(parsed.data, authContext);
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    if (error instanceof InsufficientPermissionError) {
      return { error: "Voce nao possui permissao para gerenciar categorias" };
    }

    if (
      error instanceof CategoryInUseError ||
      error instanceof DefaultCategoryArchiveNotAllowedError ||
      error instanceof CategoryNotFoundError
    ) {
      return { error: error.message };
    }

    throw error;
  }
}
