export class OrganizationAccessDeniedError extends Error {
  constructor() {
    super("Você não possui acesso a esta organização");
    this.name = "OrganizationAccessDeniedError";
  }
}
