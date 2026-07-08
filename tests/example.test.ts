import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate } from "@/shared/lib/format";

describe("format utilities", () => {
  it("should format currency in BRL", () => {
    expect(formatCurrency(1500.5)).toContain("1.500,50");
  });

  it("should format date in pt-BR", () => {
    const date = new Date("2026-07-07T12:00:00");
    expect(formatDate(date)).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});
