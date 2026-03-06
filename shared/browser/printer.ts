import { z } from "zod";

// export const PRINTER_STATUSES = ["IDLE", "PREPARE", "RUNNING", "PAUSE", "FINISH", "FAILED", "UNKNOWN"] as const;
export enum PrinterStatusEnum {
  IDLE = "IDLE",
  PREPARE = "PREPARE",
  RUNNING = "RUNNING",
  PAUSE = "PAUSE",
  FINISH = "FINISH",
  FAILED = "FAILED",
  UNKNOWN = "UNKNOWN",
}

export const printerStatusSchema = z.object({
  status: z.enum(PrinterStatusEnum),
  temperature: z.number(),
  wifi: z.string(),
});

export type PrinterStatus = z.infer<typeof printerStatusSchema>;
// export type PrinterStatusEnum = (typeof PRINTER_STATUSES)[number];
