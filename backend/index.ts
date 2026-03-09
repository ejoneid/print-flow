import { serve } from "bun";
import { zipToObject } from "radash";
import { PRINT_STATUSES, printQueueItemSchema } from "shared/browser/printQueueItem.ts";
import { type UserUpdate, userUpdateSchema } from "shared/browser/user.ts";
import z from "zod";
import {
  getPrintQueue,
  getPrintQueueItem,
  getPrintsForUser,
  postPrintQueue,
  updatePrintStatus,
} from "./src/print-queue/printQueueService.ts";
import { printCoreService } from "./src/printer/printCoreService.ts";
import { s3Service } from "./src/s3/s3Service.ts";
import { getAuthDetails } from "./src/security/requestContext.ts";
import { authDetailsToUser } from "./src/user/mappers.ts";
import { userService } from "./src/user/userService.ts";
import { internalServerErrorResponse, notFoundResponse } from "./src/utils/responses.ts";
import { jsonResponseOr404, respondWith204OrError } from "./src/utils/responseUtils.ts";

const port = process.env.PORT ?? 3001;

serve({
  port: port,
  routes: {
    "/api/status": {
      GET: () => new Response("OK"),
    },
    "/api/self": {
      GET: jsonResponseOr404(() => {
        const authDetails = getAuthDetails();
        return authDetailsToUser(authDetails);
      }),
    },
    "/api/users": {
      GET: jsonResponseOr404(userService.getUsers),
    },
    "/api/users/:uuid": {
      GET: jsonResponseOr404(async (req) => {
        const userUuid = req.params.uuid as UUID;
        return await userService.getUser(userUuid);
      }),
      PATCH: jsonResponseOr404(async (req) => {
        const userUuid = req.params.uuid as UUID;
        const update: UserUpdate = userUpdateSchema.parse(await req.json());
        return await userService.updateUser(userUuid, update);
      }),
    },
    "/api/users/:uuid/prints": {
      GET: jsonResponseOr404(async (req) => {
        const userUuid = z.uuid().parse(req.params.uuid) as UUID;
        return await getPrintsForUser(userUuid);
      }),
    },

    "/api/prints": {
      GET: jsonResponseOr404(getPrintQueue),
      POST: respondWith204OrError(async (req) => {
        const body = printQueueItemSchema.parse(await req.json());
        await postPrintQueue(body);
      }),
    },
    "/api/prints/:uuid": {
      GET: jsonResponseOr404(async (req) => {
        const printUuid = z.uuid().parse(req.params.uuid) as UUID;
        return await getPrintQueueItem(printUuid);
      }),
    },
    "/api/prints/:uuid/status": {
      PUT: respondWith204OrError(async (req) => {
        const printUuid = z.uuid().parse(req.params.uuid) as UUID;
        const status = z.enum(PRINT_STATUSES).parse((await req.json())?.status);
        await updatePrintStatus(printUuid, status);
      }),
    },
    "/api/prints/:uuid/files": {
      GET: jsonResponseOr404(async (req) => {
        const printUuid = z.uuid().parse(req.params.uuid) as UUID;
        return await s3Service.getPrintFiles(printUuid);
      }),
      POST: jsonResponseOr404(async (req) => {
        const printUuid = z.uuid().parse(req.params.uuid) as UUID;
        const body = await req.json();
        const fileNames = z.array(z.string()).parse(body.fileNames);
        return zipToObject(fileNames, (fileName: string) => s3Service.getUploadUrlForPrintFile(printUuid, fileName));
      }),
    },
    "/api/prints/:uuid/files/:fileName": {
      GET: jsonResponseOr404(async (req) => {
        const printUuid = z.uuid().parse(req.params.uuid) as UUID;
        const fileName = z.string().parse(req.params.fileName);
        return { url: s3Service.getDownloadUrlForPrintFile(printUuid, fileName) };
      }),
      DELETE: respondWith204OrError(async (req) => {
        const printUuid = z.uuid().parse(req.params.uuid) as UUID;
        const fileName = z.string().parse(req.params.fileName);
        await s3Service.deletePrintFile(printUuid, fileName);
      }),
    },

    "/api/printer/status": {
      GET: jsonResponseOr404(async (_req) => {
        return await printCoreService.getPrinterStatus();
      }),
    },
  },
  fetch: (req) => notFoundResponse(`Not found: ${req.url}`),
  error: (error) => internalServerErrorResponse(`Internal Error: ${error.message}`),
});

console.log(`Server started on port ${port}`);
