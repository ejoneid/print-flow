import { serve } from "bun";
import { getPrintQueue, postPrintQueue } from "./src/print-queue/printQueueService.ts";
import { withLogging } from "./src/utils/logginUtils.ts";
import { withAuthentication } from "./src/security/withAuthentication.ts";
import { getUser } from "./src/user/userService.ts";
import { internalServerErrorResponse, notFoundResponse } from "./src/utils/responses.ts";

const port = process.env.PORT ?? 3001;

serve({
  port: port,
  routes: {
    "/api/status": {
      GET: () => new Response("OK"),
    },
    "/api/user": {
      GET: withLogging(withAuthentication(getUser)),
    },
    "/api/print-queue": {
      GET: withLogging(withAuthentication(getPrintQueue)),
      POST: withLogging(withAuthentication(postPrintQueue)),
    },
  },
  fetch: (req) => notFoundResponse(`Not found: ${req.url}`),
  error: (error) => internalServerErrorResponse(`Internal Error: ${error.message}`),
});

console.log(`Server started on port ${port}`);
