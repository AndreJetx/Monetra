import { auth } from "@/shared/auth/auth";
import { createAuthContext, authorize } from "@/features/identity/application/authorize";
import { CategoryType } from "@/features/financial/shared/types/CategoryType";
import {
  createListCategoriesUseCase,
  createListExpensesUseCase,
} from "@/features/financial/infrastructure/factories";
import { CreateExpenseForm } from "@/features/financial/presentation/components/CreateExpenseForm";
import { ExpenseList } from "@/features/financial/presentation/components/ExpenseList";

export const metadata = {
  title: "Despesas",
};

export default async function ExpensesPage() {
  const session = await auth();
  const authContext = createAuthContext(session);

  if (!authContext) {
    return null;
  }

  const canCreateExpense = authorize(authContext.role, "expense:create");
  const categories = await createListCategoriesUseCase().execute(authContext, CategoryType.EXPENSE);
  const expenses = await createListExpensesUseCase().execute(authContext);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Despesas</h1>
        <p className="text-muted-foreground">
          Registre e acompanhe as saidas financeiras da organizacao ativa.
        </p>
      </div>

      {canCreateExpense ? (
        <CreateExpenseForm
          categories={categories.map((category) => {
            const data = category.toPrimitives();
            return { id: data.id ?? "", name: data.name };
          })}
        />
      ) : (
        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          Voce tem acesso somente de leitura para despesas.
        </p>
      )}

      <ExpenseList expenses={expenses} />
    </div>
  );
}
