import { z } from "zod";

export const CreateCustomerSchema = z.object({
  name: z.string().trim().min(1, "Nome obrigatorio").max(255, "Nome muito longo"),
  email: z
    .string()
    .trim()
    .email("E-mail invalido")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value && value.length > 0 ? value : undefined)),
  phone: z
    .string()
    .trim()
    .max(20, "Telefone muito longo")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value && value.length > 0 ? value : undefined)),
  document: z
    .string()
    .trim()
    .max(20, "Documento muito longo")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value && value.length > 0 ? value : undefined)),
});

export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>;
