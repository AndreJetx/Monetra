import { auth } from "@/shared/auth/auth";
import { createAuthContext, authorize } from "@/features/identity/application/authorize";
import {
  createGetCashFlowUseCase,
  createListCategoriesUseCase,
} from "@/features/financial/infrastructure/factories";
import { formatPeriodLabel } from "@/features/financial/shared/cashFlowPeriods";
import {
  formatDateInput,
  parseGetCashFlowParams,
} from "@/features/financial/shared/schemas/GetCashFlowSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { formatCurrency } from "@/shared/lib/format";

export const metadata = {
  title: "Fluxo de caixa",
};

type CashFlowPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CashFlowPage({ searchParams }: CashFlowPageProps) {
  const session = await auth();
  const authContext = createAuthContext(session);

  if (!authContext) {
    return null;
  }

  const canViewReport = authorize(authContext.role, "report:view");
  const params = await searchParams;
  const filters = parseGetCashFlowParams(params);
  const categories = await createListCategoriesUseCase().execute(authContext);
  const cashFlow = canViewReport
    ? await createGetCashFlowUseCase().execute(filters, authContext)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Fluxo de caixa</h1>
        <p className="text-muted-foreground">
          Acompanhe entradas e saidas confirmadas da organizacao ativa.
        </p>
      </div>

      {!canViewReport ? (
        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          Voce nao tem permissao para visualizar relatorios financeiros.
        </p>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <form method="get" className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <label className="space-y-1 text-sm">
                  <span className="font-medium">Visao</span>
                  <select
                    name="view"
                    defaultValue={filters.view}
                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2"
                  >
                    <option value="daily">Diaria</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                    <option value="yearly">Anual</option>
                  </select>
                </label>

                <label className="space-y-1 text-sm">
                  <span className="font-medium">De</span>
                  <input
                    type="date"
                    name="from"
                    defaultValue={formatDateInput(filters.from)}
                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2"
                  />
                </label>

                <label className="space-y-1 text-sm">
                  <span className="font-medium">Ate</span>
                  <input
                    type="date"
                    name="to"
                    defaultValue={formatDateInput(filters.to)}
                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2"
                  />
                </label>

                <label className="space-y-1 text-sm">
                  <span className="font-medium">Categoria</span>
                  <select
                    name="categoryId"
                    defaultValue={filters.categoryId ?? ""}
                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2"
                  >
                    <option value="">Todas</option>
                    {categories.map((category) => {
                      const data = category.toPrimitives();
                      return (
                        <option key={data.id} value={data.id}>
                          {data.name} ({data.type})
                        </option>
                      );
                    })}
                  </select>
                </label>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                  >
                    Aplicar
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>

          {cashFlow ? (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Entradas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold text-emerald-600">
                      {formatCurrency(cashFlow.totalRevenues)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Saidas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold text-red-600">
                      {formatCurrency(cashFlow.totalExpenses)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Saldo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">{formatCurrency(cashFlow.balance)}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Movimentacoes por periodo</CardTitle>
                </CardHeader>
                <CardContent>
                  {cashFlow.buckets.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma movimentacao confirmada no periodo selecionado.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[640px] text-sm">
                        <thead>
                          <tr className="border-b text-left text-muted-foreground">
                            <th className="px-3 py-2 font-medium">Periodo</th>
                            <th className="px-3 py-2 font-medium">Entradas</th>
                            <th className="px-3 py-2 font-medium">Saidas</th>
                            <th className="px-3 py-2 font-medium">Saldo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cashFlow.buckets.map((bucket) => (
                            <tr key={bucket.period} className="border-b last:border-0">
                              <td className="px-3 py-2">
                                {formatPeriodLabel(bucket.period, filters.view)}
                              </td>
                              <td className="px-3 py-2 text-emerald-600">
                                {formatCurrency(bucket.revenues)}
                              </td>
                              <td className="px-3 py-2 text-red-600">
                                {formatCurrency(bucket.expenses)}
                              </td>
                              <td className="px-3 py-2 font-medium">
                                {formatCurrency(bucket.balance)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
