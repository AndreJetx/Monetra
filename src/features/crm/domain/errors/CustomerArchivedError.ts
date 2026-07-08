export class CustomerArchivedError extends Error {
  constructor() {
    super("Cliente arquivado nao pode ser vinculado a novos lancamentos");
    this.name = "CustomerArchivedError";
  }
}
