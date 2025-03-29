import { Database } from "bun:sqlite";

const DB_FILE = process.env.DB_LOCATION ?? "print-flow.sqlite";
export const db = new Database(DB_FILE, { strict: true, create: true });
