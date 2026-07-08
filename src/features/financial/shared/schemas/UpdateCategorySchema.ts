import { z } from "zod";

export const UpdateCategorySchema = z.object({
  id: z.string().min(1, "Categoria invalida"),
  name: z.string().min(1, "Nome e obrigatorio").max(100, "Nome muito longo"),
});

export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
