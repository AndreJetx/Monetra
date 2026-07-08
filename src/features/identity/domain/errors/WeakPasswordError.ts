export class WeakPasswordError extends Error {
  constructor() {
    super("Senha não atende aos critérios de segurança");
    this.name = "WeakPasswordError";
  }
}
