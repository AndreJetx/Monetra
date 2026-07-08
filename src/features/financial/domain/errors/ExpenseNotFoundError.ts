export class ExpenseNotFoundError extends Error {
  constructor() {
    super("Despesa nao encontrada");
    this.name = "ExpenseNotFoundError";
  }
}
