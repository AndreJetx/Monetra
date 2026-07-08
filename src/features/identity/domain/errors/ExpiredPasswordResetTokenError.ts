export class ExpiredPasswordResetTokenError extends Error {
  constructor() {
    super("Token de recuperação expirado");
    this.name = "ExpiredPasswordResetTokenError";
  }
}
