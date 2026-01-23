import type { BunRequest } from "bun";
import { NotFoundError, UnauthorizedError } from "../errors";
import type { AuthDetails, AuthenticatedRequestHandler } from "../security/withAuthentication";
import { notFoundResponse, forbiddenResponse, internalServerErrorResponse } from "./responses";

export const respondWith204OrError = <TRequest extends BunRequest>(
  serviceFunction: (req: TRequest, authDetails: AuthDetails) => void | Promise<void>,
): AuthenticatedRequestHandler<TRequest> => {
  return async (req: TRequest, authDetails: AuthDetails): Promise<Response> => {
    try {
      await serviceFunction(req, authDetails);
      return new Response(null, { status: 204 });
    } catch (error: unknown) {
      if (error instanceof NotFoundError) return notFoundResponse(error.message);
      if (error instanceof UnauthorizedError) return forbiddenResponse(error.message);
      if (error instanceof Error) return internalServerErrorResponse(`Internal Error: ${error.message}`);
      return internalServerErrorResponse(`Internal Error: Unknown error`);
    }
  };
};
