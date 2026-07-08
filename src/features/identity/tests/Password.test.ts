import { describe, expect, it } from "vitest";
import { WeakPasswordError } from "@/features/identity/domain/errors/WeakPasswordError";
import { Password } from "@/features/identity/domain/value-objects/Password";

describe("Password", () => {
  it("aceita senha válida", () => {
    const password = Password.create("Monetra123");
    expect(password.value()).toBe("Monetra123");
  });

  it("rejeita senha sem número", () => {
    expect(() => Password.create("MonetraAA")).toThrow(WeakPasswordError);
  });

  it("rejeita senha sem maiúscula", () => {
    expect(() => Password.create("monetra123")).toThrow(WeakPasswordError);
  });

  it("rejeita senha curta", () => {
    expect(() => Password.create("Mon12")).toThrow(WeakPasswordError);
  });
});
