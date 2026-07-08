import { z } from "zod";

export const CreateRevenueSchema = z.object({
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
  categoryId: z.string().min(1, "Categoria invalida"),
  dueDate: z.coerce.date(),
  customerId: z.string().optional(),
  description: z.string().max(500, "Descricao muito longa").optional(),
});

export type CreateRevenueInput = z.infer<typeof CreateRevenueSchema>;
