import { logger } from "shared/node";
import type { BunRequest } from "bun";

export type RequestHandler = (req: BunRequest) => Response | Promise<Response>;

export const withLogging = (handler: RequestHandler): RequestHandler => {
  return async (req: BunRequest): Promise<Response> => {
    logger.info(`${req.method} ${req.url} - Resolving...`);
    const result = (await handler(req)) as Response;
    logger.info(`${req.method} ${req.url} - ${result.status}`);
    return result;
  };
};
