export class InvalidPasswordResetTokenError extends Error {
  constructor() {
    super("Token de recuperação inválido");
    this.name = "InvalidPasswordResetTokenError";
  }
}
