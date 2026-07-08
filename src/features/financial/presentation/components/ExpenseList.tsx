import type { Expense } from "@/features/financial/domain/entities/Expense";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ExpenseRowActions } from "@/features/financial/presentation/components/ExpenseRowActions";

type ExpenseListProps = {
  expenses: Expense[];
  canConfirm: boolean;
};

export function ExpenseList({ expenses, canConfirm }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhuma despesa cadastrada ate o momento.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Despesas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {expenses.map((expense) => {
          const data = expense.toPrimitives();
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
                  <ExpenseRowActions expenseId={data.id} />
                </div>
              ) : null}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
