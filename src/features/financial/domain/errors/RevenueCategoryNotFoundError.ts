export class RevenueCategoryNotFoundError extends Error {
  constructor() {
    super("Categoria de receita nao encontrada");
    this.name = "RevenueCategoryNotFoundError";
  }
}
