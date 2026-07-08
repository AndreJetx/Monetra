"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  createExpenseAction,
  type ExpenseActionState,
} from "@/features/financial/presentation/actions/expense.actions";

const initialState: ExpenseActionState = {};

type CategoryOption = {
  id: string;
  name: string;
};

type CreateExpenseFormProps = {
  categories: CategoryOption[];
};

export function CreateExpenseForm({ categories }: CreateExpenseFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createExpenseAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <form action={formAction} className="space-y-4 rounded-lg border p-4">
      <div>
        <h2 className="text-lg font-semibold">Nova despesa</h2>
        <p className="text-sm text-muted-foreground">
          Registre saidas financeiras da organizacao ativa.
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
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Data de vencimento</Label>
        <Input id="dueDate" name="dueDate" type="date" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="supplierId">Fornecedor (opcional)</Label>
        <Input id="supplierId" name="supplierId" placeholder="ID do fornecedor" />
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
        {isPending ? "Salvando..." : "Cadastrar despesa"}
      </Button>
    </form>
  );
}
