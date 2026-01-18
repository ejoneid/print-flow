import { USER_ROLES, type UserRole } from "shared/browser";

export function isUserRoles(value: unknown): value is UserRole[] {
  return (
    Array.isArray(value) && value.every((role) => USER_ROLES.includes(role))
  );
}
