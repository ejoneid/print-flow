
// Define handler type
type RequestHandler = (req: Request) => Response | Promise<Response>;

// Middleware function to add logging with TypeScript types
export const withLogging = (handler: RequestHandler): RequestHandler => {
    return async (req: Request): Promise<Response> => {
        const timestamp = new Date().toISOString();
        const result = (await handler(req)) as Response;
        console.log(`[${timestamp}] ${req.method} ${req.url} - ${result.status}`);
        return result;
    };
};