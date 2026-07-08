export class CustomerNotFoundError extends Error {
  constructor() {
    super("Cliente nao encontrado");
    this.name = "CustomerNotFoundError";
  }
}
