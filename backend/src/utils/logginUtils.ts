import { logger } from "shared/node";
import type { BunRequest } from "bun";

export type RequestHandler<TRequest extends BunRequest> = (req: TRequest) => Response | Promise<Response>;

export const withLogging = <TRequest extends BunRequest>(
  handler: RequestHandler<TRequest>,
): RequestHandler<TRequest> => {
  return async (req: TRequest): Promise<Response> => {
    logger.info(`${req.method} ${req.url} - Resolving...`);
    const result = (await handler(req)) as Response;
    logger.info(`${req.method} ${req.url} - ${result.status}`);
    return result;
  };
};
