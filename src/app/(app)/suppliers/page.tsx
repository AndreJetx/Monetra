import { auth } from "@/shared/auth/auth";
import { createAuthContext, authorize } from "@/features/identity/application/authorize";
import { createListSuppliersUseCase } from "@/features/crm/infrastructure/factories";
import { CreateSupplierForm } from "@/features/crm/presentation/components/CreateSupplierForm";
import { SupplierList } from "@/features/crm/presentation/components/SupplierList";

export const metadata = {
  title: "Fornecedores",
};

export default async function SuppliersPage() {
  const session = await auth();
  const authContext = createAuthContext(session);

  if (!authContext) {
    return null;
  }

  const canCreateSupplier = authorize(authContext.role, "supplier:create");
  const canViewSuppliers = authorize(authContext.role, "supplier:view");
  const suppliers = canViewSuppliers ? await createListSuppliersUseCase().execute(authContext) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Fornecedores</h1>
        <p className="text-muted-foreground">
          Gerencie o cadastro de fornecedores vinculaveis as despesas da organizacao ativa.
        </p>
      </div>

      {canCreateSupplier ? (
        <CreateSupplierForm />
      ) : (
        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          Voce tem acesso somente de leitura para fornecedores.
        </p>
      )}

      <SupplierList
        suppliers={suppliers.map((supplier) => {
          const data = supplier.toPrimitives();
          return {
            id: data.id ?? "",
            name: data.name,
            email: data.email,
            phone: data.phone,
            document: data.document,
          };
        })}
      />
    </div>
  );
}
