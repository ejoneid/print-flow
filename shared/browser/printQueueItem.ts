import { z } from "zod";

export const printQueueItem = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  modelLink: z.string().url({
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

export type PrintQueueItemBody = z.infer<typeof printQueueItem>;

export type Material = {
  type: string;
  color: string;
};

export type PrintStatus = "pending" | "approved" | "printing" | "completed" | "rejected";

export type PrintQueueItemType = {
  uuid: string;
  name: string;
  requester: string;
  modelLink: string;
  materials: Material[];
  status: PrintStatus;
  requestDate: string;
  completionDate: string | null;
  imageUrl: string | null;
};
