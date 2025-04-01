import type { BunRequest } from "bun";
import { randomUUIDv7 } from "bun";
import { db } from "../db.ts";
import { z } from "zod";
import type { AuthDetails } from "../auth/authenticationUtils.ts";
import {Forbidden} from "../auth/authenticationUtils.ts";

export function getPrintQueue(req: BunRequest, authDetails: AuthDetails): Response {
  if (!authDetails.permissions.has("read")) {
    return Forbidden("User does not have permission to read print queue");
  }
  const selectPrintQueueStatement = db.query("SELECT * FROM print_queue");
  const printQueue = selectPrintQueueStatement.all();
  return Response.json(printQueue);
}

const PrintItemSchema = z.object({
  name: z.string(),
  url: z.string().nullable(),
});

export async function postPrintQueue(req: BunRequest, authDetails: AuthDetails): Promise<Response> {
  if (!authDetails.permissions.has("request_print")) {
    return Forbidden("User does not have permission to request print");
  }
  const body = PrintItemSchema.parse(await req.json());
  const insertPrintQueueStatement = db.query(
    "INSERT INTO print_queue (uuid, name, url, status, status_updated_by, created_by) VALUES ($uuid, $name, $url, $status, $status_updated_by, $created_by) RETURNING *",
  );
  const created = insertPrintQueueStatement.get({
    uuid: randomUUIDv7(),
    name: body.name,
    url: body.url,
    status: "pending",
    status_updated_by: authDetails.userUuid,
    created_by: authDetails.userUuid,
  });
  return Response.json(created);
}
