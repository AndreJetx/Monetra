import { z } from "zod";

export const CreateExpenseSchema = z.object({
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
  categoryId: z.string().min(1, "Categoria invalida"),
  dueDate: z.coerce.date(),
  supplierId: z.string().optional(),
  description: z.string().max(500, "Descricao muito longa").optional(),
});

export type CreateExpenseInput = z.infer<typeof CreateExpenseSchema>;
