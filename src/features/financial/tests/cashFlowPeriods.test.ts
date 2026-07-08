import { describe, expect, it } from "vitest";
import {
  buildCashFlowBuckets,
  getPeriodKey,
  listPeriodKeysInRange,
} from "@/features/financial/shared/cashFlowPeriods";

describe("cashFlowPeriods", () => {
  it("agrupa por dia", () => {
    const from = new Date(2026, 6, 1);
    const to = new Date(2026, 6, 2);

    const buckets = buildCashFlowBuckets(
      "daily",
      from,
      to,
      [{ amount: 100, confirmedAt: new Date(2026, 6, 1, 10, 0, 0) }],
      [{ amount: 40, confirmedAt: new Date(2026, 6, 2, 15, 0, 0) }],
    );

    expect(buckets).toEqual([
      { period: "2026-07-01", revenues: 100, expenses: 0, balance: 100 },
      { period: "2026-07-02", revenues: 0, expenses: 40, balance: -40 },
    ]);
  });

  it("agrupa por mes", () => {
    const from = new Date(2026, 5, 1);
    const to = new Date(2026, 6, 31);

    const buckets = buildCashFlowBuckets(
      "monthly",
      from,
      to,
      [{ amount: 200, confirmedAt: new Date(2026, 5, 15) }],
      [{ amount: 50, confirmedAt: new Date(2026, 6, 10) }],
    );

    expect(buckets).toEqual([
      { period: "2026-06", revenues: 200, expenses: 0, balance: 200 },
      { period: "2026-07", revenues: 0, expenses: 50, balance: -50 },
    ]);
  });

  it("calcula chave de semana ISO", () => {
    expect(getPeriodKey(new Date(2026, 0, 1), "weekly")).toBe("2026-W01");
    expect(getPeriodKey(new Date(2026, 11, 31), "weekly")).toBe("2026-W53");
  });

  it("lista periodos entre virada de ano", () => {
    const keys = listPeriodKeysInRange(new Date(2025, 11, 30), new Date(2026, 0, 2), "daily");

    expect(keys).toEqual(["2025-12-30", "2025-12-31", "2026-01-01", "2026-01-02"]);
  });
});
