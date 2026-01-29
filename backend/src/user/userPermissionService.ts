import { UnauthorizedError } from "../errors";
import { getAuthDetails } from "../security/requestContext";
import type { AuthDetails } from "../security/withAuthentication";
import { SELF_CHANGEABLE_USER_FIELDS, ADMIN_CHANGEABLE_USER_FIELDS } from "shared/browser";

class UserPermissionService {
  getPermittedFields(userUuid: UUID, authDetails: AuthDetails): (keyof AuthDetails)[] {
    const permittedFields = new Set<keyof AuthDetails>();
    if (authDetails.permissions.has("manage_users")) {
      ADMIN_CHANGEABLE_USER_FIELDS.forEach((field) => {
        permittedFields.add(field);
      });
    }
    if (userUuid === authDetails.userUuid) {
      SELF_CHANGEABLE_USER_FIELDS.forEach((field) => {
        permittedFields.add(field);
      });
    }
    return Array.from(permittedFields);
  }

  canViewUserOrError(userUuid: UUID) {
    const authDetails = getAuthDetails();
    if (userUuid === authDetails.userUuid) return;
    if (!authDetails.permissions.has("view_users"))
      throw new UnauthorizedError(`You do not have permission to view user ${userUuid}`);
  }
}

export const userPermissionService = new UserPermissionService();
