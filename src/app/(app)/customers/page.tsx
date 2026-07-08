import { auth } from "@/shared/auth/auth";
import { createAuthContext, authorize } from "@/features/identity/application/authorize";
import { createListCustomersUseCase } from "@/features/crm/infrastructure/factories";
import { CreateCustomerForm } from "@/features/crm/presentation/components/CreateCustomerForm";
import { CustomerList } from "@/features/crm/presentation/components/CustomerList";

export const metadata = {
  title: "Clientes",
};

export default async function CustomersPage() {
  const session = await auth();
  const authContext = createAuthContext(session);

  if (!authContext) {
    return null;
  }

  const canCreateCustomer = authorize(authContext.role, "customer:create");
  const canViewCustomers = authorize(authContext.role, "customer:view");
  const customers = canViewCustomers ? await createListCustomersUseCase().execute(authContext) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <p className="text-muted-foreground">
          Gerencie o cadastro de clientes vinculaveis as receitas da organizacao ativa.
        </p>
      </div>

      {canCreateCustomer ? (
        <CreateCustomerForm />
      ) : (
        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          Voce tem acesso somente de leitura para clientes.
        </p>
      )}

      <CustomerList
        customers={customers.map((customer) => {
          const data = customer.toPrimitives();
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
