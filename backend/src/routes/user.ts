import type { AuthDetails } from "../auth/authenticationUtils.ts";
import type { BunRequest } from "bun";

export const getUser = (req: BunRequest, authDetails: AuthDetails): Response => {
  return Response.json({
    userUuid: authDetails.userUuid,
    roles: Array.from(authDetails.roles),
    permissions: Array.from(authDetails.permissions),
  });
};
