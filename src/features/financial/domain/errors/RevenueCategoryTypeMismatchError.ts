export class RevenueCategoryTypeMismatchError extends Error {
  constructor() {
    super("Receita deve utilizar categoria do tipo REVENUE");
    this.name = "RevenueCategoryTypeMismatchError";
  }
}
