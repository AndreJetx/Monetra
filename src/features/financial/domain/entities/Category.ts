import type { CategoryType } from "@/features/financial/shared/types/CategoryType";
import { InvalidCategoryNameError } from "@/features/financial/domain/errors/InvalidCategoryNameError";
import { DefaultCategoryArchiveNotAllowedError } from "@/features/financial/domain/errors/DefaultCategoryArchiveNotAllowedError";

export class Category {
  private constructor(
    private readonly props: {
      id?: string;
      organizationId: string;
      name: string;
      type: CategoryType;
      isDefault: boolean;
      archivedAt: Date | null;
      createdAt?: Date;
    },
  ) {}

  static create(input: {
    id?: string;
    organizationId: string;
    name: string;
    type: CategoryType;
    isDefault?: boolean;
    archivedAt?: Date | null;
    createdAt?: Date;
  }): Category {
    const name = input.name.trim();

    if (name.length < 1 || name.length > 100) {
      throw new InvalidCategoryNameError();
    }

    return new Category({
      id: input.id,
      organizationId: input.organizationId,
      name,
      type: input.type,
      isDefault: input.isDefault ?? false,
      archivedAt: input.archivedAt ?? null,
      createdAt: input.createdAt,
    });
  }

  archive(): void {
    if (this.props.isDefault) {
      throw new DefaultCategoryArchiveNotAllowedError();
    }

    this.props.archivedAt = new Date();
  }

  rename(name: string): void {
    const normalizedName = name.trim();

    if (normalizedName.length < 1 || normalizedName.length > 100) {
      throw new InvalidCategoryNameError();
    }

    this.props.name = normalizedName;
  }

  toPrimitives() {
    return { ...this.props };
  }

  getId(): string | undefined {
    return this.props.id;
  }

  getOrganizationId(): string {
    return this.props.organizationId;
  }

  getName(): string {
    return this.props.name;
  }

  getType(): CategoryType {
    return this.props.type;
  }

  isDefault(): boolean {
    return this.props.isDefault;
  }

  getArchivedAt(): Date | null {
    return this.props.archivedAt;
  }
}
