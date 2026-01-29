import type { PrintFlowUser, PrintFlowUserInfo, PrintQueueItem } from "shared/browser";
import { kyClient } from "./queryClient";

export const QUERIES = {
  queue: {
    queryKey: ["queue"],
    queryFn: () => kyClient("/api/print-queue").json<PrintQueueItem[]>(),
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
} as const;
