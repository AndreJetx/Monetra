export interface IPasswordResetMailer {
  sendPasswordResetEmail(email: string, token: string): Promise<void>;
}
