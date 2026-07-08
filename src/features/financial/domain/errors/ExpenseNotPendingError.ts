export class ExpenseNotPendingError extends Error {
  constructor() {
    super("Despesa nao esta pendente e nao pode ser confirmada");
    this.name = "ExpenseNotPendingError";
  }
}
