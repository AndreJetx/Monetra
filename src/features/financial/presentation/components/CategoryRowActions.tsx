"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  archiveCategoryAction,
  type CategoryActionState,
  updateCategoryAction,
} from "@/features/financial/presentation/actions/category.actions";

type CategoryRowActionsProps = {
  id: string;
  name: string;
  isDefault: boolean;
};

const initialState: CategoryActionState = {};

export function CategoryRowActions({ id, name, isDefault }: CategoryRowActionsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [updateState, updateFormAction, updatePending] = useActionState(
    updateCategoryAction,
    initialState,
  );
  const [archiveState, archiveFormAction, archivePending] = useActionState(
    archiveCategoryAction,
    initialState,
  );

  useEffect(() => {
    if (updateState.success || archiveState.success) {
      router.refresh();
    }
  }, [archiveState.success, router, updateState.success]);

  const showEditForm = isEditing && !updateState.success;

  return (
    <div className="space-y-2">
      {showEditForm ? (
        <form action={updateFormAction} className="flex items-center gap-2">
          <input type="hidden" name="id" value={id} />
          <Input name="name" defaultValue={name} required />
          <Button type="submit" size="sm" disabled={updatePending}>
            Salvar
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
            Cancelar
          </Button>
        </form>
      ) : (
        <div className="flex items-center gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => setIsEditing(true)}>
            Editar
          </Button>
          <form action={archiveFormAction}>
            <input type="hidden" name="id" value={id} />
            <Button type="submit" size="sm" variant="ghost" disabled={archivePending || isDefault}>
              Arquivar
            </Button>
          </form>
        </div>
      )}
      {updateState.error ? <p className="text-sm text-destructive">{updateState.error}</p> : null}
      {archiveState.error ? <p className="text-sm text-destructive">{archiveState.error}</p> : null}
    </div>
  );
}
