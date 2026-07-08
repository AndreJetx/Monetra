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
  loginAction,
  type AuthActionState,
} from "@/features/identity/presentation/actions/auth.actions";

const initialState: AuthActionState = {};

export function LoginForm({ registered }: { registered?: boolean }) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Acesse sua conta para continuar.</CardDescription>
      </CardHeader>
      <CardContent>
        {registered ? (
          <p className="mb-4 rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">
            Conta criada com sucesso. Faça login para continuar.
          </p>
        ) : null}
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-primary hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <Input id="password" name="password" type="password" required />
          </div>
          {state.error ? (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
