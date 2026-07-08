import type { ITokenGenerator } from "@/features/identity/application/ports/ITokenGenerator";

export class CryptoTokenGenerator implements ITokenGenerator {
  generate(): string {
    // Web Crypto API: compatível com Node.js e Edge Runtime.
    const bytes = new Uint8Array(32);
    globalThis.crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
}
