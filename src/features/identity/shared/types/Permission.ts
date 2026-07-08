export const permissions = [
  "revenue:create",
  "revenue:edit",
  "revenue:delete",
  "revenue:view",
  "expense:create",
  "expense:edit",
  "expense:delete",
  "expense:view",
  "organization:manage",
  "member:invite",
  "member:manage",
  "role:change",
  "report:view",
  "report:export",
  "category:manage",
  "customer:create",
  "customer:view",
  "supplier:create",
  "supplier:view",
] as const;

export type Permission = (typeof permissions)[number];
