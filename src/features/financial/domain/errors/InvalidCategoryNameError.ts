export class InvalidCategoryNameError extends Error {
  constructor() {
    super("Nome da categoria deve ter entre 1 e 100 caracteres");
    this.name = "InvalidCategoryNameError";
  }
}
