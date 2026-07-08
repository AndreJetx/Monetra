"use server";

import { ForgotPasswordSchema } from "@/features/identity/shared/schemas/ForgotPasswordSchema";
import { ResetPasswordSchema } from "@/features/identity/shared/schemas/ResetPasswordSchema";
import { InvalidEmailError } from "@/features/identity/domain/errors/InvalidEmailError";
import { WeakPasswordError } from "@/features/identity/domain/errors/WeakPasswordError";
import { InvalidPasswordResetTokenError } from "@/features/identity/domain/errors/InvalidPasswordResetTokenError";
import { ExpiredPasswordResetTokenError } from "@/features/identity/domain/errors/ExpiredPasswordResetTokenError";
import {
  createForgotPasswordUseCase,
  createResetPasswordUseCase,
} from "@/features/identity/infrastructure/factories";

export type PasswordResetActionState = {
  success?: boolean;
  error?: string;
};

export async function forgotPasswordAction(
  _prevState: PasswordResetActionState,
  formData: FormData,
): Promise<PasswordResetActionState> {
  const parsed = ForgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados inválidos" };
  }

  const useCase = createForgotPasswordUseCase();

  try {
    await useCase.execute({ email: parsed.data.email });
  } catch (error) {
    // RN-IDENTITY-004: resposta genérica — e-mail inválido não revela existência.
    if (error instanceof InvalidEmailError) {
      return { success: true };
    }
    throw error;
  }

  return { success: true };
}

export async function resetPasswordAction(
  _prevState: PasswordResetActionState,
  formData: FormData,
): Promise<PasswordResetActionState> {
  const parsed = ResetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados inválidos" };
  }

  const useCase = createResetPasswordUseCase();

  try {
    await useCase.execute({
      token: parsed.data.token,
      password: parsed.data.password,
    });
  } catch (error) {
    if (error instanceof InvalidPasswordResetTokenError) {
      return { error: "Link de recuperação inválido. Solicite um novo." };
    }

    if (error instanceof ExpiredPasswordResetTokenError) {
      return { error: "Link de recuperação expirado. Solicite um novo." };
    }

    if (error instanceof WeakPasswordError) {
      return { error: error.message };
    }

    throw error;
  }

  return { success: true };
}
