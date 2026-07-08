"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import {
  confirmRevenueReceiptAction,
  type RevenueActionState,
} from "@/features/financial/presentation/actions/revenue.actions";

type RevenueRowActionsProps = {
  revenueId: string;
};

const initialState: RevenueActionState = {};

export function RevenueRowActions({ revenueId }: RevenueRowActionsProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(confirmRevenueReceiptAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <div className="space-y-2">
      <form action={formAction}>
        <input type="hidden" name="id" value={revenueId} />
        <Button type="submit" size="sm" variant="outline" disabled={isPending}>
          {isPending ? "Confirmando..." : "Confirmar recebimento"}
        </Button>
      </form>
      {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
    </div>
  );
}
