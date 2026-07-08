export class DefaultCategoryArchiveNotAllowedError extends Error {
  constructor() {
    super("Categorias padrao nao podem ser arquivadas");
    this.name = "DefaultCategoryArchiveNotAllowedError";
  }
}
