export class ExpenseCategoryNotFoundError extends Error {
  constructor() {
    super("Categoria de despesa nao encontrada");
    this.name = "ExpenseCategoryNotFoundError";
  }
}
