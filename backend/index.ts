import { serve } from "bun";
import { approvePrint, getPrintQueue, postPrintQueue } from "./src/print-queue/printQueueService.ts";
import { withAuthentication } from "./src/security/withAuthentication.ts";
import { userService } from "./src/user/userService.ts";
import { jsonResponseOr404 } from "./src/utils/jsonResponseOr404.ts";
import { withLogging } from "./src/utils/logginUtils.ts";
import { internalServerErrorResponse, notFoundResponse } from "./src/utils/responses.ts";
import { userUpdateSchema, type UserUpdate } from "shared/browser/user.ts";
import { authDetailsToUser } from "./src/user/mappers.ts";

const port = process.env.PORT ?? 3001;

serve({
  port: port,
  routes: {
    "/api/status": {
      GET: () => new Response("OK"),
    },
    "/api/self": {
      GET: withLogging(withAuthentication(jsonResponseOr404((_, authDetails) => authDetailsToUser(authDetails)))),
    },
    "/api/users": {
      GET: withLogging(withAuthentication(jsonResponseOr404((_, authDetails) => userService.getUsers(authDetails)))),
    },
    "/api/users/:uuid": {
      PATCH: withLogging(
        withAuthentication(
          jsonResponseOr404(async (req, authDetails) => {
            const userUuid = req.params.uuid as UUID;
            const update: UserUpdate = userUpdateSchema.parse(await req.json());
            return await userService.updateUser(userUuid, update, authDetails);
          }),
        ),
      ),
    },
    "/api/print-queue": {
      GET: withLogging(withAuthentication(getPrintQueue)),
      POST: withLogging(withAuthentication(postPrintQueue)),
    },
    "/api/print-queue/:uuid/approve": {
      POST: withLogging(withAuthentication(approvePrint)),
    },
  },
  fetch: (req) => notFoundResponse(`Not found: ${req.url}`),
  error: (error) => internalServerErrorResponse(`Internal Error: ${error.message}`),
});

console.log(`Server started on port ${port}`);
