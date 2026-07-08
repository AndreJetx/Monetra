import { InvalidCustomerNameError } from "@/features/crm/domain/errors/InvalidCustomerNameError";

type CustomerProps = {
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

export class Customer {
  private constructor(private readonly props: CustomerProps) {}

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
  }): Customer {
    const name = input.name.trim();

    if (name.length < 1 || name.length > 255) {
      throw new InvalidCustomerNameError();
    }

    return new Customer({
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

  toPrimitives(): CustomerProps {
    return { ...this.props };
  }

  getId(): string | undefined {
    return this.props.id;
  }

  isArchived(): boolean {
    return this.props.archivedAt !== null;
  }
}
