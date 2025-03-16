import type { BunRequest } from "bun";
import {db} from "../db.ts";
import {z} from "zod";

export function getPrintQueue(req: BunRequest): Response {
    const selectPrintQueueStatement = db.query("SELECT * FROM print_queue");
    const printQueue = selectPrintQueueStatement.all();
    return Response.json(printQueue);
}

const PrintItemSchema = z.object({
    name: z.string(),
    url: z.string().nullable(),
});

export async function postPrintQueue(req: BunRequest): Promise<Response> {
    const body = PrintItemSchema.parse(await req.json());
    const insertPrintQueueStatement = db.query("INSERT INTO print_queue (name, url) VALUES ($name, $url) RETURNING *");
    const created = insertPrintQueueStatement.get(body);
    return Response.json(created);
}
