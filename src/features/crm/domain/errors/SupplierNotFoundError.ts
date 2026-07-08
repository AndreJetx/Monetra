export class SupplierNotFoundError extends Error {
  constructor() {
    super("Fornecedor nao encontrado");
    this.name = "SupplierNotFoundError";
  }
}
