import { z } from "zod";

export const printRequestFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  requesterName: z.string().min(2, {
    message: "Your name must be at least 2 characters.",
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
