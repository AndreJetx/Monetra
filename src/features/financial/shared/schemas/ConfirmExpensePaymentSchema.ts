import { z } from "zod";

export const ConfirmExpensePaymentSchema = z.object({
  id: z.string().min(1, "Despesa invalida"),
  paidAt: z.coerce.date().optional(),
});

export type ConfirmExpensePaymentInput = z.infer<typeof ConfirmExpensePaymentSchema>;
