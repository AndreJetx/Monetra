import bcrypt from "bcryptjs";
import type { IPasswordHasher } from "@/features/identity/application/ports/IPasswordHasher";

export class BcryptPasswordHasher implements IPasswordHasher {
  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, 12);
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
