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
  resetPasswordAction,
  type PasswordResetActionState,
} from "@/features/identity/presentation/actions/password-reset.actions";

const initialState: PasswordResetActionState = {};

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Redefinir senha</CardTitle>
        <CardDescription>Escolha uma nova senha para sua conta.</CardDescription>
      </CardHeader>
      <CardContent>
        {state.success ? (
          <div className="space-y-4">
            <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary" role="status">
              Senha redefinida com sucesso. Faça login com a nova senha.
            </p>
            <Button asChild className="w-full">
              <Link href="/login">Ir para o login</Link>
            </Button>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="token" value={token} />
            <div className="space-y-2">
              <Label htmlFor="password">Nova senha</Label>
              <Input id="password" name="password" type="password" required />
              <p className="text-xs text-muted-foreground">
                Mínimo de 8 caracteres, com letra maiúscula e número.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required />
            </div>
            {state.error ? (
              <p className="text-sm text-destructive" role="alert">
                {state.error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Redefinindo..." : "Redefinir senha"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Link expirado?{" "}
          <Link href="/forgot-password" className="text-primary hover:underline">
            Solicitar novo
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
