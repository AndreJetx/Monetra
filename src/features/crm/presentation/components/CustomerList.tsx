import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

type CustomerListItem = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  document: string | null;
};

type CustomerListProps = {
  customers: CustomerListItem[];
};

export function CustomerList({ customers }: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhum cliente cadastrado ate o momento.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Clientes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {customers.map((customer) => (
          <div key={customer.id} className="rounded-md border p-3">
            <p className="font-medium">{customer.name}</p>
            {customer.email ? (
              <p className="text-sm text-muted-foreground">E-mail: {customer.email}</p>
            ) : null}
            {customer.phone ? (
              <p className="text-sm text-muted-foreground">Telefone: {customer.phone}</p>
            ) : null}
            {customer.document ? (
              <p className="text-sm text-muted-foreground">Documento: {customer.document}</p>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
