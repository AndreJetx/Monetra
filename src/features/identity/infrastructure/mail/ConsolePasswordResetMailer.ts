import type { IPasswordResetMailer } from "@/features/identity/application/ports/IPasswordResetMailer";

/**
 * Mailer de desenvolvimento: registra o link de recuperação no console do servidor.
 * Substituir por um adapter SMTP real quando o envio de e-mail for configurado (V1).
 */
export class ConsolePasswordResetMailer implements IPasswordResetMailer {
  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const baseUrl = process.env.AUTH_URL ?? "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password/${token}`;

    console.info(`[password-reset] Para: ${email}`);
    console.info(`[password-reset] Link: ${resetUrl}`);
  }
}
