import type { AuthDetails } from "../auth/authenticationUtils.ts";
import type { BunRequest } from "bun";
import type { PrintFlowUser } from "shared/browser";

export const getUser = (req: BunRequest, authDetails: AuthDetails): Response => {
  return Response.json({
    userUuid: authDetails.userUuid,
    fullName: authDetails.fullName,
    email: authDetails.email,
    avatar: authDetails.avatar,
    roles: Array.from(authDetails.roles),
    permissions: Array.from(authDetails.permissions),
  } satisfies PrintFlowUser);
};
