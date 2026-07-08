import { z } from "zod";
import { CategoryType } from "@/features/financial/shared/types/CategoryType";

export const CreateCategorySchema = z.object({
  name: z.string().min(1, "Nome e obrigatorio").max(100, "Nome muito longo"),
  type: z.nativeEnum(CategoryType, { message: "Tipo invalido" }),
});

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
