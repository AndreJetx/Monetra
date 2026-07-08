"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/shared/auth/auth";
import { LoginSchema } from "@/features/identity/shared/schemas/LoginSchema";
import { RegisterSchema } from "@/features/identity/shared/schemas/RegisterSchema";
import { EmailAlreadyInUseError } from "@/features/identity/domain/errors/EmailAlreadyInUseError";
import { InvalidEmailError } from "@/features/identity/domain/errors/InvalidEmailError";
import { WeakPasswordError } from "@/features/identity/domain/errors/WeakPasswordError";
import { createRegisterUserUseCase } from "@/features/identity/infrastructure/factories";

export type AuthActionState = {
  error?: string;
};

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados inválidos" };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email.trim().toLowerCase(),
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "E-mail ou senha inválidos" };
    }
    throw error;
  }

  return {};
}

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = RegisterSchema.safeParse({
    name: formData.get("name"),
    organizationName: formData.get("organizationName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados inválidos" };
  }

  const registerUserUseCase = createRegisterUserUseCase();

  try {
    await registerUserUseCase.execute(parsed.data);
  } catch (error) {
    if (error instanceof EmailAlreadyInUseError) {
      return { error: "Este e-mail já está em uso" };
    }

    if (error instanceof InvalidEmailError || error instanceof WeakPasswordError) {
      return { error: error.message };
    }

    throw error;
  }

  redirect("/login?registered=1");
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
