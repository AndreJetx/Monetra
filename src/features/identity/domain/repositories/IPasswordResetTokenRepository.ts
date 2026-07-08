export type PasswordResetToken = {
  email: string;
  token: string;
  expiresAt: Date;
};

export interface IPasswordResetTokenRepository {
  create(data: PasswordResetToken): Promise<void>;
  findByToken(token: string): Promise<PasswordResetToken | null>;
  deleteAllForEmail(email: string): Promise<void>;
}
