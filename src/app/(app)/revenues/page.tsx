import { auth } from "@/shared/auth/auth";
import { createAuthContext, authorize } from "@/features/identity/application/authorize";
import { CategoryType } from "@/features/financial/shared/types/CategoryType";
import {
  createListCategoriesUseCase,
  createListRevenuesUseCase,
} from "@/features/financial/infrastructure/factories";
import { CreateRevenueForm } from "@/features/financial/presentation/components/CreateRevenueForm";
import { RevenueList } from "@/features/financial/presentation/components/RevenueList";

export const metadata = {
  title: "Receitas",
};

export default async function RevenuesPage() {
  const session = await auth();
  const authContext = createAuthContext(session);

  if (!authContext) {
    return null;
  }

  const canCreateRevenue = authorize(authContext.role, "revenue:create");
  const categories = await createListCategoriesUseCase().execute(authContext, CategoryType.REVENUE);
  const revenues = await createListRevenuesUseCase().execute(authContext);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Receitas</h1>
        <p className="text-muted-foreground">
          Registre e acompanhe as entradas financeiras da organizacao ativa.
        </p>
      </div>

      {canCreateRevenue ? (
        <CreateRevenueForm categories={categories} />
      ) : (
        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          Voce tem acesso somente de leitura para receitas.
        </p>
      )}

      <RevenueList revenues={revenues} />
    </div>
  );
}
