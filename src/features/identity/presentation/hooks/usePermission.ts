"use client";

import { useSession } from "next-auth/react";
import { authorize } from "@/features/identity/application/authorize";
import type { Permission } from "@/features/identity/shared/types/Permission";

export function usePermission(permission: Permission): boolean {
  const { data: session } = useSession();
  const role = session?.user?.role;

  if (!role) {
    return false;
  }

  return authorize(role, permission);
}
