import type { DefaultSession } from "next-auth";
import type { Role } from "@/features/identity/shared/types/Role";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      activeOrganizationId?: string;
      role?: Role;
    } & DefaultSession["user"];
  }

  interface User {
    activeOrganizationId?: string;
    role?: Role;
  }
}
