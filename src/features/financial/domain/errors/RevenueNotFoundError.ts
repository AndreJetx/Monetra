export class RevenueNotFoundError extends Error {
  constructor() {
    super("Receita nao encontrada");
    this.name = "RevenueNotFoundError";
  }
}
