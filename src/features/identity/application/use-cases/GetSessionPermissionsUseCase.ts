import { permissions } from "@/features/identity/shared/types/Permission";
import type { Permission } from "@/features/identity/shared/types/Permission";
import type { Role } from "@/features/identity/shared/types/Role";
import { authorize } from "@/features/identity/application/authorize";

export class GetSessionPermissionsUseCase {
  execute(role: Role): Permission[] {
    return permissions.filter((permission) => authorize(role, permission));
  }
}
