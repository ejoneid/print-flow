import { type BunRequest, randomUUIDv7 } from "bun";
import {
  type PrintQueueItemBody,
  printQueueItemSchema,
  type PrintQueueItemType,
  type PrintQueueItemTypeDto,
} from "shared/browser";
import { z } from "zod/v4";
import {
  columnsToString,
  db,
  MATERIAL_COLUMNS,
  type MaterialEntity,
  PRINT_QUEUE_COLUMNS,
  type PrintQueueEntity,
} from "../db.ts";
import type { AuthDetails } from "../security/withAuthentication.ts";

import { forbiddenResponse } from "../utils/responses.ts";
import { extractType } from "../utils/typeUtils.ts";
import { getImageUrl } from "./imageUrlScraper.ts";
import { userService } from "../user/userService.ts";

export async function getPrintQueue(_: BunRequest, authDetails: AuthDetails): Promise<Response> {
  if (!authDetails.permissions.has("read")) {
    return forbiddenResponse("User does not have permission to read print queue");
  }
  const entities = selectPrintQueueStatement.all(null);
  const printQueue = joinPrintQueueAndMaterials(entities);
  const requesterUuids = printQueue.map((item) => item.requester);
  const requestersMap = await userService.getUserMetaDataByIds(requesterUuids);
  const result = printQueue.map((item) => ({
    ...item,
    requester: requestersMap.get(item.requester)!.fullName,
  }));
  return Response.json(result satisfies PrintQueueItemTypeDto[]);
}

export async function postPrintQueue(req: BunRequest, authDetails: AuthDetails): Promise<Response> {
  if (!authDetails.permissions.has("request_print")) {
    return forbiddenResponse("User does not have permission to request print");
  }
  const body = printQueueItemSchema.parse(await req.json());
  const imageUrl = await getImageUrl(body.modelLink);
  insertTransaction(body, imageUrl, authDetails.userUuid);
  return new Response(null, { status: 204 });
}

export async function approvePrint(
  req: BunRequest<"/api/print-queue/:uuid/approve">,
  authDetails: AuthDetails,
): Promise<Response> {
  if (!authDetails.permissions.has("approve_print")) {
    return forbiddenResponse("User does not have permission to approve print");
  }
  const printUuid = z.uuid().parse(req.params.uuid);
  approvePrintStatement.run({
    uuid: printUuid,
    status_updated_by: authDetails.userUuid,
    // status_updated_at: new Date(),
    // $uuid: printUuid,
    // $status_update_at: new Date(),
    // $status_updat
  });
  return new Response(null, { status: 204 });
}

function joinPrintQueueAndMaterials(dbRows: (PrintQueueEntity & MaterialEntity)[]): PrintQueueItemType[] {
  const rowsByItemUuid = Object.groupBy(dbRows, (item) => item.uuid);
  return Object.values(rowsByItemUuid)
    .map((itemRows) => {
      const item = extractType(itemRows![0], PRINT_QUEUE_COLUMNS, "uuid");
      if (!item) return undefined;
      const materials = itemRows!
        .map((materialRow) => extractType(materialRow, MATERIAL_COLUMNS, "print_queue_uuid"))
        .filter((material) => material !== undefined);

      return {
        uuid: item.uuid,
        name: item.name,
        status: item.status,
        requester: item.created_by,
        modelLink: item.url,
        requestDate: item.created_at,
        completionDate: item.completed_at,
        imageUrl: item.image_url,
        materials: materials.map((material) => ({
          type: material.type,
          color: material.color,
        })),
      };
    })
    .filter((item) => !!item);
}

const SELECT_PRINT_QUEUE_SQL = `SELECT ${columnsToString(PRINT_QUEUE_COLUMNS, "pq")}, ${columnsToString(MATERIAL_COLUMNS, "m")}
                                FROM print_queue pq
                                       LEFT JOIN material m ON pq.uuid = m.print_queue_uuid`;
const selectPrintQueueStatement = db.query<PrintQueueEntity & MaterialEntity, null>(SELECT_PRINT_QUEUE_SQL);
const insertPrintQueueStatement = db.query<PrintQueueEntity, Omit<PrintQueueEntity, "created_at" | "completed_at">>(
  "INSERT INTO print_queue (uuid, name, url, image_url, status, status_updated_by, created_by) VALUES ($uuid, $name, $url, $image_url, $status, $status_updated_by, $created_by) RETURNING *",
);

const insertMaterialStatement = db.query(
  "INSERT INTO material (uuid, print_queue_uuid, type, color) VALUES ($uuid, $print_queue_uuid, $type, $color) RETURNING *",
);

// const APPROVED_STATUS: PrintStatus = "approved";
const approvePrintStatement = db.query(
  "UPDATE print_queue SET status = 'approved', status_updated_at = $status_updated_at, status_updated_by = $status_updated_by WHERE uuid = $uuid AND status != 'approved'",
);

const insertTransaction = db.transaction((body: PrintQueueItemBody, imageUrl: string | null, userUuid: UUID) => {
  const uuid = randomUUIDv7() as UUID;
  insertPrintQueueStatement.run({
    uuid: uuid,
    name: body.name,
    url: body.modelLink,
    image_url: imageUrl,
    status: "pending",
    status_updated_by: userUuid,
    created_by: userUuid,
  });
  for (const material of body.materials) {
    insertMaterialStatement.run({
      uuid: randomUUIDv7(),
      print_queue_uuid: uuid,
      type: material.type,
      color: material.color,
    });
  }
});
