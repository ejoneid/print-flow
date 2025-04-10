import type { BunRequest } from "bun";
import { randomUUIDv7 } from "bun";
import { db, PrintQueueEntity } from "../db.ts";
import type { AuthDetails } from "../auth/authenticationUtils.ts";
import {printQueueItem} from "shared/browser";
import type { PrintQueueItemType } from "shared/browser";
import { forbiddenResponse } from "../utils/responses.ts";

export function getPrintQueue(req: BunRequest, authDetails: AuthDetails): Response {
  if (!authDetails.permissions.has("read")) {
    return forbiddenResponse("User does not have permission to read print queue");
  }
  const selectPrintQueueStatement = db.query("SELECT * FROM print_queue").as(PrintQueueEntity);
  const printQueue = selectPrintQueueStatement.all();
  const printQueueItems: PrintQueueItemType[] = printQueue.map((item) => ({
    uuid: item.uuid,
    name: item.name,
    modelLink: item.url,
    materials: [{ type: "PLA", color: "Black" }],
    requestDate: item.created_at,
    completionDate: item.completed_at,
    requester: "John Doe",
    status: item.status as "pending" | "approved" | "printing" | "completed" | "rejected",
  }));
  return Response.json(printQueueItems);
}

export async function postPrintQueue(req: BunRequest, authDetails: AuthDetails): Promise<Response> {
  if (!authDetails.permissions.has("request_print")) {
    return forbiddenResponse("User does not have permission to request print");
  }
  const body = printQueueItem.parse(await req.json());
  const insertPrintQueueStatement = db.query(
    "INSERT INTO print_queue (uuid, name, url, status, status_updated_by, created_by) VALUES ($uuid, $name, $url, $status, $status_updated_by, $created_by) RETURNING *",
  );
  const created = insertPrintQueueStatement.get({
    uuid: randomUUIDv7(),
    name: body.name,
    url: body.modelLink,
    status: "pending",
    status_updated_by: authDetails.userUuid,
    created_by: authDetails.userUuid,
  });
  return Response.json(true);
}
