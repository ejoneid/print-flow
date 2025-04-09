import UserRoles from "supertokens-node/recipe/userroles";
import type { UserPermission, UserRole } from "shared/browser";

export const userRoles: Record<UserRole, { name: UserRole; permissions: UserPermission[] }> = {
  ADMIN: {
    name: "ADMIN",
    permissions: ["read", "write", "request_print", "approve_print"],
  },
  USER: {
    name: "USER",
    permissions: ["read", "request_print"],
  },
};

export async function initUserRoles() {
  for (const role of Object.values(userRoles)) {
    const response = await UserRoles.createNewRoleOrAddPermissions(role.name, role.permissions);
    console.log({ ...response, role });
  }
}
