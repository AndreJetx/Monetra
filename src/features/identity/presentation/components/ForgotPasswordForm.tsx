"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  forgotPasswordAction,
  type PasswordResetActionState,
} from "@/features/identity/presentation/actions/password-reset.actions";

const initialState: PasswordResetActionState = {};

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recuperar senha</CardTitle>
        <CardDescription>
          Informe seu e-mail e enviaremos instruções para redefinir sua senha.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state.success ? (
          <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary" role="status">
            Se o e-mail informado estiver cadastrado, você receberá as instruções de recuperação.
          </p>
        ) : (
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
            </div>
            {state.error ? (
              <p className="text-sm text-destructive" role="alert">
                {state.error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Enviando..." : "Enviar instruções"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Lembrou a senha?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Voltar ao login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
