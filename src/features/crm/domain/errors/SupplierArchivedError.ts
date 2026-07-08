export class SupplierArchivedError extends Error {
  constructor() {
    super("Fornecedor arquivado nao pode ser vinculado a novos lancamentos");
    this.name = "SupplierArchivedError";
  }
}
