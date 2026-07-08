export class SupplierNameAlreadyExistsError extends Error {
  constructor() {
    super("Ja existe um fornecedor com este nome na organizacao");
    this.name = "SupplierNameAlreadyExistsError";
  }
}
