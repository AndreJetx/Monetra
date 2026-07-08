import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

type SupplierListItem = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  document: string | null;
};

type SupplierListProps = {
  suppliers: SupplierListItem[];
};

export function SupplierList({ suppliers }: SupplierListProps) {
  if (suppliers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Fornecedores</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nenhum fornecedor cadastrado ate o momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Fornecedores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="rounded-md border p-3">
            <p className="font-medium">{supplier.name}</p>
            {supplier.email ? (
              <p className="text-sm text-muted-foreground">E-mail: {supplier.email}</p>
            ) : null}
            {supplier.phone ? (
              <p className="text-sm text-muted-foreground">Telefone: {supplier.phone}</p>
            ) : null}
            {supplier.document ? (
              <p className="text-sm text-muted-foreground">Documento: {supplier.document}</p>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
