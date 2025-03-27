import type { AuthDetails } from "../utils/authenticationUtils.ts";
import type { BunRequest } from "bun";

export const getUser = (req: BunRequest, authDetails: AuthDetails): Response => {
  return Response.json({
    userUuid: authDetails.userUuid,
  });
};
