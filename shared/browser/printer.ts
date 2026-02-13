import { z } from "zod";

export const PRINTER_STATUSES = ["IDLE", "PREPARE", "RUNNING", "PAUSE", "FINISH", "FAILED", "UNKNOWN"] as const;

export const printerStatusSchema = z.object({
  status: z.enum(PRINTER_STATUSES),
  temperature: z.number(),
  wifi: z.string(),
});

export type PrinterStatus = z.infer<typeof printerStatusSchema>;
export type PrinterStatusEnum = (typeof PRINTER_STATUSES)[number];
