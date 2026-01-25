import { z } from "zod";

export const printQueueItemSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  modelLink: z.url({
    message: "Please enter a valid URL.",
  }),
  description: z.string().optional(),
  materials: z
    .array(
      z.object({
        type: z.string().min(1, { message: "Material type is required" }),
        color: z.string().min(1, { message: "Material color is required" }),
      }),
    )
    .min(1, { message: "At least one material is required" }),
});

export type PrintQueueItemBody = z.infer<typeof printQueueItemSchema>;

export type Material = {
  type: string;
  color: string;
};

export const PRINT_STATUSES = ["pending", "approved", "printing", "completed", "rejected"] as const;
export type PrintStatus = (typeof PRINT_STATUSES)[number];

export type PrintQueueItem = {
  uuid: UUID;
  name: string;
  requester: UUID;
  modelLink: string;
  materials: Material[];
  status: PrintStatus;
  requestDate: string;
  completionDate: string | null;
  imageUrl: string | null;
};

export type PrintQueueItemDto = {
  uuid: UUID;
  name: string;
  requester: string;
  modelLink: string;
  materials: Material[];
  status: PrintStatus;
  requestDate: string;
  completionDate: string | null;
  imageUrl: string | null;
};
