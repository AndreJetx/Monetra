import { auth } from "@/shared/auth/auth";
import { createAuthContext, authorize } from "@/features/identity/application/authorize";
import { CategoryList } from "@/features/financial/presentation/components/CategoryList";
import { CategoryCreateSection } from "@/features/financial/presentation/components/CategoryCreateSection";
import { createListCategoriesUseCase } from "@/features/financial/infrastructure/factories";

export const metadata = {
  title: "Categorias",
};

export default async function CategoriesPage() {
  const session = await auth();
  const authContext = createAuthContext(session);

  if (!authContext) {
    return null;
  }

  const categories = await createListCategoriesUseCase().execute(authContext);
  const canManage = authorize(authContext.role, "category:manage");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Categorias</h1>
        <p className="text-muted-foreground">
          Organize receitas e despesas da organizacao ativa com categorias padronizadas.
        </p>
      </div>

      <CategoryCreateSection />
      <CategoryList
        canManage={canManage}
        categories={categories.map((category) => category.toPrimitives())}
      />
    </div>
  );
}
