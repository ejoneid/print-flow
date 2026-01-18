import z from "zod";

export const USER_ROLES = ["USER", "ADMIN"] as const;
export const USER_PERMISSIONS = [
  "read",
  "write",
  "request_print",
  "approve_print",
  "manage_users",
  "view_users",
] as const;
export type UserRole = (typeof USER_ROLES)[number];
export type UserPermission = (typeof USER_PERMISSIONS)[number];

export const USER_ROLES_PERMISSIONS: Record<UserRole, { name: UserRole; permissions: UserPermission[] }> = {
  ADMIN: {
    name: "ADMIN",
    permissions: ["read", "write", "request_print", "approve_print", "manage_users", "view_users"],
  },
  USER: {
    name: "USER",
    permissions: ["read", "request_print"],
  },
};

export type PrintFlowUser = {
  userUuid: UUID;
  fullName: string;
  email: string;
  avatar: string | undefined;
  roles: UserRole[];
  permissions: UserPermission[];
};

export type PrintFlowUserInfo = {
  userUuid: UUID;
  fullName: string;
  email: string;
  avatar: string | undefined;
  roles: UserRole[];
};

export type UserMetaData = {
  fullName: string;
  avatar: string | undefined;
};

export const SELF_CHANGEABLE_USER_FIELDS = [
  "fullName",
  "email",
  "avatar",
] as const satisfies (keyof PrintFlowUserInfo)[];
export const ADMIN_CHANGEABLE_USER_FIELDS = ["roles"] as const satisfies (keyof PrintFlowUserInfo)[];
export type UpdateableUserField =
  | (typeof SELF_CHANGEABLE_USER_FIELDS)[number]
  | (typeof ADMIN_CHANGEABLE_USER_FIELDS)[number];

export type UserUpdate = Partial<Pick<PrintFlowUser, UpdateableUserField>>;
export const userUpdateSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  avatar: z.string().url().optional(),
  roles: z.array(z.enum(USER_ROLES)).optional(),
  permissions: z.array(z.enum(USER_PERMISSIONS)).optional(),
});
