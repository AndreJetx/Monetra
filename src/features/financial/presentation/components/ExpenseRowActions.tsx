"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import {
  confirmExpensePaymentAction,
  type ExpenseActionState,
} from "@/features/financial/presentation/actions/expense.actions";

type ExpenseRowActionsProps = {
  expenseId: string;
};

const initialState: ExpenseActionState = {};

export function ExpenseRowActions({ expenseId }: ExpenseRowActionsProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(confirmExpensePaymentAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <div className="space-y-2">
      <form action={formAction}>
        <input type="hidden" name="id" value={expenseId} />
        <Button type="submit" size="sm" variant="outline" disabled={isPending}>
          {isPending ? "Confirmando..." : "Confirmar pagamento"}
        </Button>
      </form>
      {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
    </div>
  );
}
