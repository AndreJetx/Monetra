import { describe, expect, it } from "vitest";
import { Category } from "@/features/financial/domain/entities/Category";
import { InvalidCategoryNameError } from "@/features/financial/domain/errors/InvalidCategoryNameError";
import { DefaultCategoryArchiveNotAllowedError } from "@/features/financial/domain/errors/DefaultCategoryArchiveNotAllowedError";
import { CategoryType } from "@/features/financial/shared/types/CategoryType";

describe("Category", () => {
  it("cria categoria com nome normalizado", () => {
    const category = Category.create({
      organizationId: "org-1",
      name: "  Marketing  ",
      type: CategoryType.EXPENSE,
    });

    expect(category.getName()).toBe("Marketing");
  });

  it("falha com nome inv�lido", () => {
    expect(() =>
      Category.create({
        organizationId: "org-1",
        name: " ",
        type: CategoryType.REVENUE,
      }),
    ).toThrow(InvalidCategoryNameError);
  });

  it("bloqueia arquivamento de categoria padr�o", () => {
    const category = Category.create({
      organizationId: "org-1",
      name: "Vendas",
      type: CategoryType.REVENUE,
      isDefault: true,
    });

    expect(() => category.archive()).toThrow(DefaultCategoryArchiveNotAllowedError);
  });
});
