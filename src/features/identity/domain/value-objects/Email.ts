import { InvalidEmailError } from "@/features/identity/domain/errors/InvalidEmailError";

export class Email {
  private constructor(private readonly rawValue: string) {}

  static create(input: string): Email {
    const normalized = input.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalized)) {
      throw new InvalidEmailError();
    }

    return new Email(normalized);
  }

  value(): string {
    return this.rawValue;
  }
}
