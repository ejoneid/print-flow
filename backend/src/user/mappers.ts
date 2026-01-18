import type { PrintFlowUser, PrintFlowUserInfo } from "shared/browser";
import type { AuthDetails } from "../security/withAuthentication";

export function authDetailsToUserInfo(authDetails: AuthDetails): PrintFlowUserInfo {
  return {
    ...authDetails,
    roles: Array.from(authDetails.roles),
  };
}

export function authDetailsToUser(authDetails: AuthDetails): PrintFlowUser {
  return {
    ...authDetails,
    roles: Array.from(authDetails.roles),
    permissions: Array.from(authDetails.permissions),
  };
}
