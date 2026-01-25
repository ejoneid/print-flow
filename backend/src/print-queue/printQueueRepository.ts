import { randomUUIDv7 } from "bun";
import type { PrintQueueItemBody } from "shared/browser";
import {
  columnsToString,
  db,
  MATERIAL_COLUMNS,
  PRINT_QUEUE_COLUMNS,
  type MaterialEntity,
  type PrintQueueEntity,
} from "../db";

const SELECT_PRINT_QUEUE_SQL =
  `SELECT ${columnsToString(PRINT_QUEUE_COLUMNS, "pq")}, ${columnsToString(MATERIAL_COLUMNS, "m")}
                                FROM print_queue pq
                                       LEFT JOIN material m ON pq.uuid = m.print_queue_uuid` as const;
export const selectPrintQueueStatement = db.query<PrintQueueEntity & MaterialEntity, null>(SELECT_PRINT_QUEUE_SQL);
export const selectUserPrintQueueStatement = db.query<PrintQueueEntity & MaterialEntity, null>(
  `${SELECT_PRINT_QUEUE_SQL} WHERE pq.created_by = $userUuid` as const,
);

const SELECT_PRINT_SQL = `SELECT ${columnsToString(PRINT_QUEUE_COLUMNS, "p")} FROM print_queue p WHERE uuid = $uuid`;
export const selectPrintByUuid = db.query<PrintQueueEntity, UUID>(SELECT_PRINT_SQL);

export const insertPrintQueueStatement = db.query<
  PrintQueueEntity,
  Omit<PrintQueueEntity, "created_at" | "completed_at">
>(
  "INSERT INTO print_queue (uuid, name, url, image_url, status, status_updated_by, created_by) VALUES ($uuid, $name, $url, $image_url, $status, $status_updated_by, $created_by) RETURNING *",
);

export const insertMaterialStatement = db.query(
  "INSERT INTO material (uuid, print_queue_uuid, type, color) VALUES ($uuid, $print_queue_uuid, $type, $color) RETURNING *",
);

export const approvePrintStatement = db.query(
  "UPDATE print_queue SET status = $status, status_updated_at = $status_updated_at, status_updated_by = $status_updated_by WHERE uuid = $uuid",
);

export const insertTransaction = db.transaction((body: PrintQueueItemBody, imageUrl: string | null, userUuid: UUID) => {
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
