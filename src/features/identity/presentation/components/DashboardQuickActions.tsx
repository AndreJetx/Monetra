"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { usePermission } from "@/features/identity/presentation/hooks/usePermission";

export function DashboardQuickActions() {
  const canCreateRevenue = usePermission("revenue:create");
  const canCreateExpense = usePermission("expense:create");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acoes rapidas</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        {canCreateRevenue ? (
          <Button asChild>
            <Link href="/revenues">Nova receita</Link>
          </Button>
        ) : null}
        {canCreateExpense ? (
          <Button asChild variant="secondary">
            <Link href="/expenses">Nova despesa</Link>
          </Button>
        ) : null}
        {!canCreateRevenue && !canCreateExpense ? (
          <p className="text-sm text-muted-foreground">
            Seu papel atual possui acesso somente de leitura neste momento.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
