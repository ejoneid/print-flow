import type { AuthDetails } from "./authenticationUtils.ts";

export const TEST_USERS: Record<UUID, AuthDetails> = {
  defaultTestUserUuid: {
    userUuid: "defaultTestUserUuid",
    roles: new Set(["USER"]),
    permissions: new Set(["read", "request_print"]),
  },
  adminUserUuid: {
    userUuid: "adminUserUuid",
    roles: new Set(["ADMIN", "USER"]),
    permissions: new Set(["read", "write", "request_print", "approve_print"]),
  },
};
