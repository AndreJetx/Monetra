import { z } from "zod";

export const CashFlowViewSchema = z.enum(["daily", "weekly", "monthly", "yearly"]);

function parseLocalDateInput(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export const GetCashFlowSchema = z.object({
  view: CashFlowViewSchema.default("monthly"),
  from: z.string().transform(parseLocalDateInput),
  to: z.string().transform(parseLocalDateInput),
  categoryId: z
    .string()
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined)),
});

export type GetCashFlowInput = z.infer<typeof GetCashFlowSchema>;

export function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDefaultCashFlowParams() {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    view: "monthly" as const,
    from: formatDateInput(from),
    to: formatDateInput(to),
    categoryId: "",
  };
}

export function parseGetCashFlowParams(
  searchParams: Record<string, string | string[] | undefined>,
) {
  const defaults = getDefaultCashFlowParams();
  const raw = {
    view: typeof searchParams.view === "string" ? searchParams.view : defaults.view,
    from: typeof searchParams.from === "string" ? searchParams.from : defaults.from,
    to: typeof searchParams.to === "string" ? searchParams.to : defaults.to,
    categoryId:
      typeof searchParams.categoryId === "string" ? searchParams.categoryId : defaults.categoryId,
  };

  const parsed = GetCashFlowSchema.parse(raw);
  const from = new Date(parsed.from);
  from.setHours(0, 0, 0, 0);

  const to = new Date(parsed.to);
  to.setHours(23, 59, 59, 999);

  return {
    view: parsed.view,
    from,
    to,
    categoryId: parsed.categoryId,
  };
}
