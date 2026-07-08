export type CashFlowView = "daily" | "weekly" | "monthly" | "yearly";

export type CashFlowBucket = {
  period: string;
  revenues: number;
  expenses: number;
  balance: number;
};

type CashFlowMovement = {
  amount: number;
  confirmedAt: Date;
};

export function getPeriodKey(date: Date, view: CashFlowView): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  switch (view) {
    case "daily":
      return `${year}-${month}-${day}`;
    case "monthly":
      return `${year}-${month}`;
    case "yearly":
      return String(year);
    case "weekly":
      return getIsoWeekKey(date);
  }
}

function getIsoWeekKey(date: Date): string {
  const normalized = new Date(date.getTime());
  normalized.setHours(0, 0, 0, 0);
  normalized.setDate(normalized.getDate() + 3 - ((normalized.getDay() + 6) % 7));

  const weekYear = normalized.getFullYear();
  const weekOne = new Date(weekYear, 0, 4);
  const weekNumber =
    1 +
    Math.round(
      ((normalized.getTime() - weekOne.getTime()) / 86400000 - 3 + ((weekOne.getDay() + 6) % 7)) /
        7,
    );

  return `${weekYear}-W${String(weekNumber).padStart(2, "0")}`;
}

export function listPeriodKeysInRange(from: Date, to: Date, view: CashFlowView): string[] {
  const keys = new Set<string>();
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);

  const end = new Date(to);
  end.setHours(23, 59, 59, 999);

  while (cursor <= end) {
    keys.add(getPeriodKey(cursor, view));
    advanceCursor(cursor, view);
  }

  return Array.from(keys).sort();
}

function advanceCursor(date: Date, view: CashFlowView): void {
  switch (view) {
    case "daily":
      date.setDate(date.getDate() + 1);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1, 1);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + 1, 0, 1);
      break;
  }
}

export function buildCashFlowBuckets(
  view: CashFlowView,
  from: Date,
  to: Date,
  revenues: CashFlowMovement[],
  expenses: CashFlowMovement[],
): CashFlowBucket[] {
  const bucketMap = new Map<string, { revenues: number; expenses: number }>();

  for (const period of listPeriodKeysInRange(from, to, view)) {
    bucketMap.set(period, { revenues: 0, expenses: 0 });
  }

  for (const revenue of revenues) {
    const period = getPeriodKey(revenue.confirmedAt, view);
    const bucket = bucketMap.get(period) ?? { revenues: 0, expenses: 0 };
    bucket.revenues += revenue.amount;
    bucketMap.set(period, bucket);
  }

  for (const expense of expenses) {
    const period = getPeriodKey(expense.confirmedAt, view);
    const bucket = bucketMap.get(period) ?? { revenues: 0, expenses: 0 };
    bucket.expenses += expense.amount;
    bucketMap.set(period, bucket);
  }

  return Array.from(bucketMap.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([period, totals]) => ({
      period,
      revenues: totals.revenues,
      expenses: totals.expenses,
      balance: totals.revenues - totals.expenses,
    }));
}

export function formatPeriodLabel(period: string, view: CashFlowView): string {
  switch (view) {
    case "daily": {
      const [year, month, day] = period.split("-");
      return `${day}/${month}/${year}`;
    }
    case "monthly": {
      const [year, month] = period.split("-");
      return `${month}/${year}`;
    }
    case "yearly":
      return period;
    case "weekly":
      return period.replace("-W", " - Semana ");
  }
}
