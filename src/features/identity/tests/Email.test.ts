import { describe, expect, it } from "vitest";
import { InvalidEmailError } from "@/features/identity/domain/errors/InvalidEmailError";
import { Email } from "@/features/identity/domain/value-objects/Email";

describe("Email", () => {
  it("normaliza o e-mail para lowercase e trim", () => {
    const email = Email.create("  OWNER@Monetra.Dev ");
    expect(email.value()).toBe("owner@monetra.dev");
  });

  it("lança erro para formato inválido", () => {
    expect(() => Email.create("email-invalido")).toThrow(InvalidEmailError);
  });
});
