export class CategoryNotFoundError extends Error {
  constructor() {
    super("Categoria nao encontrada");
    this.name = "CategoryNotFoundError";
  }
}
