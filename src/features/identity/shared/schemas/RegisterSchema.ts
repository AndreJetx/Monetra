import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  organizationName: z.string().min(2, "Nome da empresa deve ter ao menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter ao menos 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter ao menos 1 letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter ao menos 1 número"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
