export class InvalidSupplierNameError extends Error {
  constructor() {
    super("Nome do fornecedor invalido");
    this.name = "InvalidSupplierNameError";
  }
}
