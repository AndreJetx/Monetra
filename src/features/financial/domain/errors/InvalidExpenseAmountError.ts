export class InvalidExpenseAmountError extends Error {
  constructor() {
    super("Valor da despesa deve ser maior que zero");
    this.name = "InvalidExpenseAmountError";
  }
}
