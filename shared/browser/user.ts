export const USER_ROLES = ["USER", "ADMIN"] as const;
export const USER_PERMISSIONS = ["read", "write", "request_print", "approve_print"] as const;
export type UserRole = (typeof USER_ROLES)[number];
export type UserPermission = (typeof USER_PERMISSIONS)[number];
