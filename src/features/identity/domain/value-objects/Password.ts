import { WeakPasswordError } from "@/features/identity/domain/errors/WeakPasswordError";

export class Password {
  private constructor(private readonly rawValue: string) {}

  static create(input: string): Password {
    const password = input.trim();
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasMinLength || !hasUpperCase || !hasNumber) {
      throw new WeakPasswordError();
    }

    return new Password(password);
  }

  value(): string {
    return this.rawValue;
  }
}
