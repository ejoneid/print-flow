import type { PrintFlowS3File, PrintFlowUser, PrintFlowUserInfo, PrintQueueItem, PrinterStatus } from "shared/browser";
import { kyClient } from "./queryClient";

export const QUERIES = {
  queue: {
    queryKey: ["queue"],
    queryFn: () => kyClient("/api/prints").json<PrintQueueItem[]>(),
  },
  userPrints: ({ userUuid }: { userUuid: UUID }) => ({
    queryKey: ["my-prints", userUuid],
    queryFn: () => kyClient(`/api/users/${userUuid}/prints`).json<PrintQueueItem[]>(),
  }),
  users: {
    queryKey: ["users"],
    queryFn: () => kyClient("/api/users").json<PrintFlowUserInfo[]>(),
  },
  user: ({ userUuid }: { userUuid: UUID }) => ({
    queryKey: ["user", userUuid],
    queryFn: () => kyClient(`/api/users/${userUuid}`).json<PrintFlowUserInfo>(),
  }),
  self: {
    queryKey: ["self"],
    queryFn: () => kyClient("/api/self").json<PrintFlowUser>(),
  },
  printerStatus: {
    queryKey: ["printer-status"],
    queryFn: () => kyClient("/api/printer/status").json<PrinterStatus>(),
  },
  uploadPrintFileUrls: ({ printUuid, fileNames }: { printUuid: UUID; fileNames: string[] }) => ({
    queryKey: ["print-file-upload", printUuid, fileNames],
    queryFn: () =>
      kyClient
        .post(`/api/prints/${printUuid}/files`, {
          json: { fileNames },
        })
        .json<{ [key in string]: string }>(),
  }),
  printFiles: ({ printUuid }: { printUuid: UUID }) => ({
    queryKey: ["print-files", printUuid],
    queryFn: () => kyClient(`/api/prints/${printUuid}/files`).json<PrintFlowS3File[]>(),
  }),
} as const;
