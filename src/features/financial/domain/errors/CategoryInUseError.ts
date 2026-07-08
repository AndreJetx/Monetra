export class CategoryInUseError extends Error {
  constructor() {
    super("Categoria em uso nao pode ser arquivada");
    this.name = "CategoryInUseError";
  }
}
