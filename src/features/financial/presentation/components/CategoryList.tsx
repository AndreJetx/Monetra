import { CategoryType } from "@/features/financial/shared/types/CategoryType";
import { CategoryRowActions } from "@/features/financial/presentation/components/CategoryRowActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

type CategoryListProps = {
  categories: Array<{
    id?: string;
    name: string;
    type: CategoryType;
    isDefault: boolean;
    archivedAt: Date | null;
  }>;
  canManage: boolean;
};

export function CategoryList({ categories, canManage }: CategoryListProps) {
  const revenueCategories = categories.filter((category) => category.type === CategoryType.REVENUE);
  const expenseCategories = categories.filter((category) => category.type === CategoryType.EXPENSE);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Receitas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {revenueCategories.map((category) => (
            <div
              key={category.id ?? `${category.type}-${category.name}`}
              className="rounded-md border p-3"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{category.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {category.isDefault ? "Categoria padrao" : "Categoria personalizada"}
                  </p>
                </div>
                {canManage && category.id ? (
                  <CategoryRowActions
                    id={category.id}
                    name={category.name}
                    isDefault={category.isDefault}
                  />
                ) : null}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Despesas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {expenseCategories.map((category) => (
            <div
              key={category.id ?? `${category.type}-${category.name}`}
              className="rounded-md border p-3"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{category.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {category.isDefault ? "Categoria padrao" : "Categoria personalizada"}
                  </p>
                </div>
                {canManage && category.id ? (
                  <CategoryRowActions
                    id={category.id}
                    name={category.name}
                    isDefault={category.isDefault}
                  />
                ) : null}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
