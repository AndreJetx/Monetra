export class ExpenseCategoryTypeMismatchError extends Error {
  constructor() {
    super("Despesa deve utilizar categoria do tipo EXPENSE");
    this.name = "ExpenseCategoryTypeMismatchError";
  }
}
