export class CustomerNameAlreadyExistsError extends Error {
  constructor() {
    super("Ja existe um cliente com este nome na organizacao");
    this.name = "CustomerNameAlreadyExistsError";
  }
}
