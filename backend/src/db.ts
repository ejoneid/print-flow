import { Database } from "bun:sqlite";
import type { PrintStatus } from "shared/browser";
import { getMigrations, migrate } from "bun-sqlite-migrations";

const DB_FILE = process.env.DB_LOCATION ?? `${import.meta.dir}/../print-flow.sqlite`;
export const db = new Database(DB_FILE, { strict: true, create: true });
migrate(db, getMigrations("./migrations"));

export type PrintQueueEntity = {
  uuid: UUID;
  name: string;
  url: string;
  status: PrintStatus;
  status_updated_by: string;
  created_by: string;
  created_at: string;
  completed_at: string | null;
};

export type MaterialEntity = {
  uuid: UUID;
  print_queue_uuid: string;
  type: string;
  color: string;
};

export function columnsToString<T>(columns: DBColumns<T>, prefix: string): string {
  return columns
    .map((column) => {
      if (typeof column === "string") {
        return `${prefix}.${column}`;
      }
      // @ts-ignore
      return `${prefix}.${column.name} AS ${column.alias}`;
    })
    .join(", ");
}

export type DBColumns<T> = (keyof T | { name: keyof T; alias: string })[];

export const PRINT_QUEUE_COLUMNS: DBColumns<PrintQueueEntity> = [
  "uuid",
  "name",
  "url",
  "status",
  "status_updated_by",
  "created_by",
  "created_at",
  "completed_at",
];
export const MATERIAL_COLUMNS: DBColumns<MaterialEntity> = ["print_queue_uuid", "type", "color"];
