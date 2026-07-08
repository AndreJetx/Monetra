import { describe, expect, it } from "vitest";
import { authorize, authorizeOrThrow } from "@/features/identity/application/authorize";
import { InsufficientPermissionError } from "@/features/identity/domain/errors/InsufficientPermissionError";
import { Role } from "@/features/identity/shared/types/Role";

describe("authorize", () => {
  it("permite todas as permissões para OWNER", () => {
    expect(authorize(Role.OWNER, "revenue:create")).toBe(true);
    expect(authorize(Role.OWNER, "expense:delete")).toBe(true);
    expect(authorize(Role.OWNER, "member:manage")).toBe(true);
    expect(authorize(Role.OWNER, "role:change")).toBe(true);
    expect(authorize(Role.OWNER, "report:export")).toBe(true);
  });

  it("permite permissões administrativas para ADMIN sem alterar papéis", () => {
    expect(authorize(Role.ADMIN, "organization:manage")).toBe(true);
    expect(authorize(Role.ADMIN, "member:invite")).toBe(true);
    expect(authorize(Role.ADMIN, "member:manage")).toBe(true);
    expect(authorize(Role.ADMIN, "category:manage")).toBe(true);
    expect(authorize(Role.ADMIN, "role:change")).toBe(false);
  });

  it("permite operações operacionais para MEMBER", () => {
    expect(authorize(Role.MEMBER, "revenue:create")).toBe(true);
    expect(authorize(Role.MEMBER, "revenue:edit")).toBe(true);
    expect(authorize(Role.MEMBER, "expense:create")).toBe(true);
    expect(authorize(Role.MEMBER, "customer:create")).toBe(true);
    expect(authorize(Role.MEMBER, "report:view")).toBe(true);
    expect(authorize(Role.MEMBER, "expense:delete")).toBe(false);
    expect(authorize(Role.MEMBER, "member:invite")).toBe(false);
  });

  it("permite apenas leitura para VIEWER", () => {
    expect(authorize(Role.VIEWER, "report:view")).toBe(true);
    expect(authorize(Role.VIEWER, "customer:view")).toBe(true);
    expect(authorize(Role.VIEWER, "revenue:view")).toBe(false);
    expect(authorize(Role.VIEWER, "revenue:create")).toBe(false);
    expect(authorize(Role.VIEWER, "customer:create")).toBe(false);
    expect(authorize(Role.VIEWER, "report:export")).toBe(false);
  });
});

describe("authorizeOrThrow", () => {
  it("lança erro quando papel não possui permissão", () => {
    expect(() => authorizeOrThrow(Role.VIEWER, "expense:create")).toThrow(
      InsufficientPermissionError,
    );
  });

  it("não lança erro quando a permissão existe", () => {
    expect(() => authorizeOrThrow(Role.ADMIN, "report:export")).not.toThrow();
  });
});
