"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { usePermission } from "@/features/identity/presentation/hooks/usePermission";

export function DashboardQuickActions() {
  const canCreateRevenue = usePermission("revenue:create");
  const canCreateExpense = usePermission("expense:create");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações rápidas</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        {canCreateRevenue ? (
          <Button type="button" disabled>
            Nova receita
          </Button>
        ) : null}
        {canCreateExpense ? (
          <Button type="button" variant="secondary" disabled>
            Nova despesa
          </Button>
        ) : null}
        {!canCreateRevenue && !canCreateExpense ? (
          <p className="text-sm text-muted-foreground">
            Seu papel atual possui acesso somente de leitura neste momento.
          </p>
        ) : (
          <p className="w-full text-sm text-muted-foreground">
            Ações financeiras serão habilitadas no próximo marco do roadmap.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
