export class CategoryNameAlreadyExistsError extends Error {
  constructor() {
    super("Ja existe uma categoria com este nome para o tipo informado");
    this.name = "CategoryNameAlreadyExistsError";
  }
}
