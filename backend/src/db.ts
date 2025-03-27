import { Database } from "bun:sqlite";

export const db = new Database("print-flow.sqlite", { strict: true });
