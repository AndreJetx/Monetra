"use client";

import { usePermission } from "@/features/identity/presentation/hooks/usePermission";
import { CreateCategoryForm } from "@/features/financial/presentation/components/CreateCategoryForm";

export function CategoryCreateSection() {
  const canManage = usePermission("category:manage");

  if (!canManage) {
    return (
      <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        Voce tem acesso de leitura as categorias da organizacao ativa.
      </p>
    );
  }

  return <CreateCategoryForm />;
}
