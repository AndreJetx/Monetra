"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { Category } from "@/features/financial/domain/entities/Category";
import {
  createRevenueAction,
  type RevenueActionState,
} from "@/features/financial/presentation/actions/revenue.actions";

const initialState: RevenueActionState = {};

type CreateRevenueFormProps = {
  categories: Category[];
};

export function CreateRevenueForm({ categories }: CreateRevenueFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createRevenueAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <form action={formAction} className="space-y-4 rounded-lg border p-4">
      <div>
        <h2 className="text-lg font-semibold">Nova receita</h2>
        <p className="text-sm text-muted-foreground">
          Registre entradas financeiras da organizacao ativa.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Valor</Label>
        <Input id="amount" name="amount" type="number" min="0.01" step="0.01" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Categoria</Label>
        <select
          id="categoryId"
          name="categoryId"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          required
          defaultValue=""
        >
          <option value="" disabled>
            Selecione uma categoria
          </option>
          {categories.map((category) => {
            const data = category.toPrimitives();
            return (
              <option key={data.id} value={data.id}>
                {data.name}
              </option>
            );
          })}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Data prevista</Label>
        <Input id="dueDate" name="dueDate" type="date" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="customerId">Cliente (opcional)</Label>
        <Input id="customerId" name="customerId" placeholder="ID do cliente" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descricao (opcional)</Label>
        <Input id="description" name="description" placeholder="Observacao" />
      </div>

      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : "Cadastrar receita"}
      </Button>
    </form>
  );
}
