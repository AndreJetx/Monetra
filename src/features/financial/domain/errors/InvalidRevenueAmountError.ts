export class InvalidRevenueAmountError extends Error {
  constructor() {
    super("Valor da receita deve ser maior que zero");
    this.name = "InvalidRevenueAmountError";
  }
}
