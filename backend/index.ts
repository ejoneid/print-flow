import { serve } from "bun";
import {
  updatePrintStatus,
  getPrintQueue,
  getPrintsForUser,
  postPrintQueue,
} from "./src/print-queue/printQueueService.ts";
import { withAuthentication } from "./src/security/withAuthentication.ts";
import { userService } from "./src/user/userService.ts";
import { jsonResponseOr404, respondWith204OrError } from "./src/utils/responseUtils.ts";
import { withLogging } from "./src/utils/logginUtils.ts";
import { internalServerErrorResponse, notFoundResponse } from "./src/utils/responses.ts";
import { userUpdateSchema, type UserUpdate } from "shared/browser/user.ts";
import { authDetailsToUser } from "./src/user/mappers.ts";
import z from "zod";
import { PRINT_STATUSES, printQueueItemSchema } from "shared/browser/printQueueItem.ts";
import { getAuthDetails } from "./src/security/requestContext.ts";
import { getPrinterStatus } from "./src/printer/printCoreService.ts";

const port = process.env.PORT ?? 3001;

serve({
  port: port,
  routes: {
    "/api/status": {
      GET: () => new Response("OK"),
    },
    "/api/self": {
      GET: withLogging(
        withAuthentication(
          jsonResponseOr404(() => {
            const authDetails = getAuthDetails();
            return authDetailsToUser(authDetails);
          }),
        ),
      ),
    },
    "/api/users": {
      GET: withLogging(withAuthentication(jsonResponseOr404(userService.getUsers))),
    },
    "/api/users/:uuid": {
      GET: withLogging(
        withAuthentication(
          jsonResponseOr404(async (req) => {
            const userUuid = req.params.uuid as UUID;
            return await userService.getUser(userUuid);
          }),
        ),
      ),
      PATCH: withLogging(
        withAuthentication(
          jsonResponseOr404(async (req) => {
            const userUuid = req.params.uuid as UUID;
            const update: UserUpdate = userUpdateSchema.parse(await req.json());
            return await userService.updateUser(userUuid, update);
          }),
        ),
      ),
    },
    "/api/users/:uuid/prints": {
      GET: withLogging(
        withAuthentication(
          jsonResponseOr404(async (req) => {
            const userUuid = z.uuid().parse(req.params.uuid) as UUID;
            return await getPrintsForUser(userUuid);
          }),
        ),
      ),
    },
    "/api/prints": {
      GET: withLogging(withAuthentication(getPrintQueue)),
      POST: withLogging(
        withAuthentication(
          respondWith204OrError(async (req) => {
            const body = printQueueItemSchema.parse(await req.json());
            await postPrintQueue(body);
          }),
        ),
      ),
    },
    "/api/prints/:uuid/status": {
      PUT: withLogging(
        withAuthentication(
          respondWith204OrError(async (req) => {
            const printUuid = z.uuid().parse(req.params.uuid) as UUID;
            const status = z.enum(PRINT_STATUSES).parse((await req.json())?.status);
            await updatePrintStatus(printUuid, status);
          }),
        ),
      ),
    },
    "/api/printer/status": {
      GET: withLogging(
        withAuthentication(
          jsonResponseOr404(async (_req) => {
            return await getPrinterStatus();
          }),
        ),
      ),
    },
  },
  fetch: (req) => notFoundResponse(`Not found: ${req.url}`),
  error: (error) => internalServerErrorResponse(`Internal Error: ${error.message}`),
});

console.log(`Server started on port ${port}`);
