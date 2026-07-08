import { z } from "zod";

export const ConfirmRevenueReceiptSchema = z.object({
  id: z.string().min(1, "Receita invalida"),
  receivedAt: z.coerce.date().optional(),
});

export type ConfirmRevenueReceiptInput = z.infer<typeof ConfirmRevenueReceiptSchema>;
