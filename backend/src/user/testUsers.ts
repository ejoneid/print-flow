import {
  USER_ROLES_PERMISSIONS,
  type UserRole,
  type UserUpdate,
} from "shared/browser/user.ts";
import type { AuthDetails } from "../security/withAuthentication.ts";

export const TEST_USERS: Record<UUID, AuthDetails> = {
  ["defaultTestUserUuid" as UUID]: {
    userUuid: "defaultTestUserUuid" as UUID,
    fullName: "Tester Testington",
    email: "tester@example.com",
    avatar: undefined,
    roles: new Set(["USER"]),
    permissions: new Set(
      (["USER"] satisfies UserRole[]).flatMap(
        (role) => USER_ROLES_PERMISSIONS[role].permissions,
      ),
    ),
  },
  ["adminUserUuid" as UUID]: {
    userUuid: "adminUserUuid" as UUID,
    fullName: "Admin Adminton",
    avatar: undefined,
    email: "admin@example.com",
    roles: new Set(["ADMIN", "USER"]),
    permissions: new Set(
      (["ADMIN", "USER"] satisfies UserRole[]).flatMap(
        (role) => USER_ROLES_PERMISSIONS[role].permissions,
      ),
    ),
  },
  guestUserUuid: {
    userUuid: "guestUserUuid",
    fullName: "Guest User",
    email: "guest@example.com",
    avatar: undefined,
    roles: new Set(),
    permissions: new Set(),
  },
};

export const userUpdateToAuthDetails = (
  update: UserUpdate,
): Partial<AuthDetails> => {
  const newRoles = new Set(update.roles);
  const authDetails: Partial<AuthDetails> = {
    ...update,
    roles: newRoles,
    permissions: new Set(
      update.roles?.flatMap((role) => USER_ROLES_PERMISSIONS[role].permissions),
    ),
  };
  if (!update.roles) delete authDetails.roles;
  if (!update.roles) delete authDetails.permissions;
  return authDetails;
};
