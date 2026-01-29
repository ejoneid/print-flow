import type { BunRequest } from "bun";
import { ZodError } from "zod";
import { NotFoundError, UnauthorizedError } from "../errors";
import type { RequestHandler } from "./logginUtils";
import { badRequestResponse, forbiddenResponse, internalServerErrorResponse, notFoundResponse } from "./responses";

export const jsonResponseOr404 = <T, TRequest extends BunRequest>(
  serviceFunction: (req: TRequest) => T | Promise<T | null | undefined>,
): RequestHandler<TRequest> => {
  return async (req: TRequest): Promise<Response> => {
    try {
      const result = await serviceFunction(req);
      if (result === null || result === undefined) {
        return notFoundResponse("Not Found");
      }
      return Response.json(result);
    } catch (error: unknown) {
      return errorResponse(error);
    }
  };
};

export const respondWith204OrError = <TRequest extends BunRequest>(
  serviceFunction: (req: TRequest) => void | Promise<void>,
): RequestHandler<TRequest> => {
  return async (req: TRequest): Promise<Response> => {
    try {
      await serviceFunction(req);
      return new Response(null, { status: 204 });
    } catch (error: unknown) {
      return errorResponse(error);
    }
  };
};

function errorResponse(error: unknown): Response {
  if (error instanceof NotFoundError) return notFoundResponse(error.message);
  if (error instanceof UnauthorizedError) return forbiddenResponse(error.message);
  if (error instanceof ZodError) return badRequestResponse(error.message);
  if (error instanceof Error) return internalServerErrorResponse(`Internal Error: ${error.message}`);
  return internalServerErrorResponse(`Internal Error: Unknown error`);
}
