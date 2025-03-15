import type { BunRequest } from "bun";
import {db} from "../db.ts";

export function getPrintQueue(req: BunRequest): Response {
    const selectPrintQueueStatement = db.query("SELECT * FROM print_queue");
    const printQueue = selectPrintQueueStatement.all();
    return Response.json(printQueue);
}

export async function postPrintQueue(req: BunRequest): Promise<Response> {
    const body = await req.json();
    const insertPrintQueueStatement = db.query("INSERT INTO print_queue (name, url) VALUES ($name, $url) RETURNING *");
    const created = insertPrintQueueStatement.get({name: body.name, url: body.url});
    return Response.json(created);
}