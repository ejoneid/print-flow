import { USER_ROLES_PERMISSIONS } from "shared/browser";
import UserRoles from "supertokens-node/recipe/userroles";

export async function initUserRoles() {
  for (const role of Object.values(USER_ROLES_PERMISSIONS)) {
    const response = await UserRoles.createNewRoleOrAddPermissions(
      role.name,
      role.permissions,
    );
    console.log({ ...response, role });
  }
}
