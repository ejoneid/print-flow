import { USER_ROLES_PERMISSIONS, type UserRole, type UserUpdate } from "shared/browser/user.ts";
import type { AuthDetails } from "../security/withAuthentication.ts";

export const TEST_USERS: Record<UUID, AuthDetails> = {
  "019c069d-9d9f-7000-afab-bcd09db382bd": {
    userUuid: "019c069d-9d9f-7000-afab-bcd09db382bd",
    fullName: "Tester Testington",
    email: "tester@example.com",
    avatar: undefined,
    roles: new Set(["USER"]),
    permissions: new Set((["USER"] satisfies UserRole[]).flatMap((role) => USER_ROLES_PERMISSIONS[role].permissions)),
  },
  "019c069f-66a2-7000-8a8e-d7dbb8491a72": {
    userUuid: "019c069f-66a2-7000-8a8e-d7dbb8491a72",
    fullName: "Admin Adminton",
    avatar: undefined,
    email: "admin@example.com",
    roles: new Set(["ADMIN", "USER"]),
    permissions: new Set(
      (["ADMIN", "USER"] satisfies UserRole[]).flatMap((role) => USER_ROLES_PERMISSIONS[role].permissions),
    ),
  },
  "019c06a1-1065-7000-95d9-57f248e49446": {
    userUuid: "019c06a1-1065-7000-95d9-57f248e49446",
    fullName: "Guest User",
    email: "guest@example.com",
    avatar: undefined,
    roles: new Set(),
    permissions: new Set(),
  },
};

export const userUpdateToAuthDetails = (update: UserUpdate): Partial<AuthDetails> => {
  const newRoles = new Set(update.roles);
  const authDetails: Partial<AuthDetails> = {
    ...update,
    roles: newRoles,
    permissions: new Set(update.roles?.flatMap((role) => USER_ROLES_PERMISSIONS[role].permissions)),
  };
  if (!update.roles) delete authDetails.roles;
  if (!update.roles) delete authDetails.permissions;
  return authDetails;
};
