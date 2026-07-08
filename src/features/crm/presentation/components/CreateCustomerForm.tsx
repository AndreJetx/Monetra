"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  createCustomerAction,
  type CustomerActionState,
} from "@/features/crm/presentation/actions/customer.actions";

const initialState: CustomerActionState = {};

export function CreateCustomerForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createCustomerAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <form action={formAction} className="space-y-4 rounded-lg border p-4">
      <div>
        <h2 className="text-lg font-semibold">Novo cliente</h2>
        <p className="text-sm text-muted-foreground">
          Cadastre clientes para vincular as receitas da organizacao ativa.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" required maxLength={255} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail (opcional)</Label>
        <Input id="email" name="email" type="email" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone (opcional)</Label>
        <Input id="phone" name="phone" maxLength={20} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="document">Documento (opcional)</Label>
        <Input id="document" name="document" maxLength={20} />
      </div>

      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : "Cadastrar cliente"}
      </Button>
    </form>
  );
}
