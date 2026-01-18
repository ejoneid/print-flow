import type { BunRequest } from "bun";
import { NotFoundError, UnauthorizedError } from "../errors";
import type {
  AuthDetails,
  AuthenticatedRequestHandler,
} from "../security/withAuthentication";
import {
  forbiddenResponse,
  internalServerErrorResponse,
  notFoundResponse,
} from "./responses";

export const jsonResponseOr404 = <T, TRequest extends BunRequest>(
  serviceFunction: (
    req: TRequest,
    authDetails: AuthDetails,
  ) => T | Promise<T | null | undefined>,
): AuthenticatedRequestHandler<TRequest> => {
  return async (req: TRequest, authDetails: AuthDetails): Promise<Response> => {
    try {
      const result = await serviceFunction(req, authDetails);
      if (result === null || result === undefined) {
        return notFoundResponse("Not Found");
      }
      return Response.json(result);
    } catch (error: unknown) {
      if (error instanceof NotFoundError)
        return notFoundResponse(error.message);
      if (error instanceof UnauthorizedError)
        return forbiddenResponse(error.message);
      if (error instanceof Error)
        return internalServerErrorResponse(`Internal Error: ${error.message}`);
      return internalServerErrorResponse(`Internal Error: Unknown error`);
    }
  };
};
