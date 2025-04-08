import { logger } from "shared/node";

export type RequestHandler = (req: Request) => Response | Promise<Response>;

export const withLogging = (handler: RequestHandler): RequestHandler => {
  return async (req: Request): Promise<Response> => {
    logger.info(`${req.method} ${req.url} - Resolving...`);
    const result = (await handler(req)) as Response;
    logger.info(`${req.method} ${req.url} - ${result.status}`);
    return result;
  };
};
