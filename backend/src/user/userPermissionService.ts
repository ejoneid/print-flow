import type { AuthDetails } from "../security/withAuthentication";
import {
  SELF_CHANGEABLE_USER_FIELDS,
  ADMIN_CHANGEABLE_USER_FIELDS,
} from "shared/browser";

export function getPermittedFields(
  userUuid: UUID,
  authDetails: AuthDetails,
): (keyof AuthDetails)[] {
  const permittedFields = new Set<keyof AuthDetails>();
  if (authDetails.permissions.has("manage_users")) {
    ADMIN_CHANGEABLE_USER_FIELDS.forEach((field) => permittedFields.add(field));
  }
  if (userUuid === authDetails.userUuid) {
    SELF_CHANGEABLE_USER_FIELDS.forEach((field) => permittedFields.add(field));
  }
  return Array.from(permittedFields);
}
