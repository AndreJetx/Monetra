import type { Session } from "next-auth";
import { Role } from "@/features/identity/shared/types/Role";
import type { Permission } from "@/features/identity/shared/types/Permission";
import { InsufficientPermissionError } from "@/features/identity/domain/errors/InsufficientPermissionError";

export type AuthContext = {
  userId: string;
  organizationId: string;
  role: Role;
};

const permissionsByRole: Record<Role, readonly Permission[]> = {
  [Role.OWNER]: [
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
  ],
  [Role.ADMIN]: [
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
    "report:view",
    "report:export",
    "category:manage",
    "customer:create",
    "customer:view",
  ],
  [Role.MEMBER]: [
    "revenue:create",
    "revenue:edit",
    "revenue:view",
    "expense:create",
    "expense:edit",
    "expense:view",
    "report:view",
    "customer:create",
    "customer:view",
  ],
  [Role.VIEWER]: ["report:view", "customer:view"],
};

export function authorize(role: Role, permission: Permission): boolean {
  return permissionsByRole[role].includes(permission);
}

export function authorizeOrThrow(role: Role, permission: Permission): void {
  if (!authorize(role, permission)) {
    throw new InsufficientPermissionError();
  }
}

export function createAuthContext(session: Session | null): AuthContext | null {
  const userId = session?.user?.id;
  const organizationId = session?.user?.activeOrganizationId;
  const role = session?.user?.role;

  if (!userId || !organizationId || !role) {
    return null;
  }

  return {
    userId,
    organizationId,
    role,
  };
}
