export class RevenueNotPendingError extends Error {
  constructor() {
    super("Receita nao esta pendente e nao pode ser confirmada");
    this.name = "RevenueNotPendingError";
  }
}
