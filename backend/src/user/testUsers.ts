import type { AuthDetails } from "../security/withAuthentication.ts";

export const TEST_USERS: Record<UUID, AuthDetails> = {
  defaultTestUserUuid: {
    userUuid: "defaultTestUserUuid",
    fullName: "Tester Testington",
    email: "tester@example.com",
    avatar: undefined,
    roles: new Set(["USER"]),
    permissions: new Set(["read", "request_print"]),
  },
  adminUserUuid: {
    userUuid: "adminUserUuid",
    fullName: "Admin Adminton",
    avatar: undefined,
    email: "admin@example.com",
    roles: new Set(["ADMIN", "USER"]),
    permissions: new Set(["read", "write", "request_print", "approve_print"]),
  },
};
