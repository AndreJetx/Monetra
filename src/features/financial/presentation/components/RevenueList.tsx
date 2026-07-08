import type { Revenue } from "@/features/financial/domain/entities/Revenue";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { RevenueRowActions } from "@/features/financial/presentation/components/RevenueRowActions";

type RevenueListProps = {
  revenues: Revenue[];
  canConfirm: boolean;
};

export function RevenueList({ revenues, canConfirm }: RevenueListProps) {
  if (revenues.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Receitas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhuma receita cadastrada ate o momento.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Receitas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {revenues.map((revenue) => {
          const data = revenue.toPrimitives();
          const formattedAmount = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(data.amount);

          return (
            <div key={data.id} className="rounded-md border p-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{formattedAmount}</p>
                  <p className="text-sm text-muted-foreground">
                    Vencimento: {data.dueDate.toLocaleDateString("pt-BR")}
                  </p>
                  {data.description ? (
                    <p className="text-sm text-muted-foreground">{data.description}</p>
                  ) : null}
                </div>
                <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                  {data.status}
                </span>
              </div>
              {canConfirm && data.status === "PENDING" && data.id ? (
                <div className="mt-3">
                  <RevenueRowActions revenueId={data.id} />
                </div>
              ) : null}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
