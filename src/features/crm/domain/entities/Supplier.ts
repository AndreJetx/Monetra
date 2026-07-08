import { InvalidSupplierNameError } from "@/features/crm/domain/errors/InvalidSupplierNameError";

type SupplierProps = {
  id?: string;
  organizationId: string;
  name: string;
  email: string | null;
  phone: string | null;
  document: string | null;
  archivedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Supplier {
  private constructor(private readonly props: SupplierProps) {}

  static create(input: {
    id?: string;
    organizationId: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    document?: string | null;
    archivedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): Supplier {
    const name = input.name.trim();

    if (name.length < 1 || name.length > 255) {
      throw new InvalidSupplierNameError();
    }

    return new Supplier({
      id: input.id,
      organizationId: input.organizationId,
      name,
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
      document: input.document?.trim() || null,
      archivedAt: input.archivedAt ?? null,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });
  }

  toPrimitives(): SupplierProps {
    return { ...this.props };
  }

  getId(): string | undefined {
    return this.props.id;
  }

  isArchived(): boolean {
    return this.props.archivedAt !== null;
  }
}
