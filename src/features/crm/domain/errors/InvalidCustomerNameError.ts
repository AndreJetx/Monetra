export class InvalidCustomerNameError extends Error {
  constructor() {
    super("Nome do cliente invalido");
    this.name = "InvalidCustomerNameError";
  }
}
