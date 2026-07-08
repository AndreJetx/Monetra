"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { CategoryType } from "@/features/financial/shared/types/CategoryType";
import {
  createCategoryAction,
  type CategoryActionState,
} from "@/features/financial/presentation/actions/category.actions";

const initialState: CategoryActionState = {};

export function CreateCategoryForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createCategoryAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <form action={formAction} className="space-y-4 rounded-lg border p-4">
      <div>
        <h2 className="text-lg font-semibold">Nova categoria</h2>
        <p className="text-sm text-muted-foreground">
          Crie categorias para receitas e despesas da organizacao ativa.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" placeholder="Ex.: Marketing" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Tipo</Label>
        <select
          id="type"
          name="type"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          defaultValue={CategoryType.EXPENSE}
        >
          <option value={CategoryType.REVENUE}>Receita</option>
          <option value={CategoryType.EXPENSE}>Despesa</option>
        </select>
      </div>
      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Criando..." : "Criar categoria"}
      </Button>
    </form>
  );
}
