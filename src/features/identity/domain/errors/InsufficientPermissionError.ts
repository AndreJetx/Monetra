export class InsufficientPermissionError extends Error {
  constructor() {
    super("Permissão insuficiente");
    this.name = "InsufficientPermissionError";
  }
}
