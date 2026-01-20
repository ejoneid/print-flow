import { PrintQueueList } from "@/components/PrintQueueList.tsx";
import { useUser } from "@/hooks/useUser.tsx";
import { kyClient } from "@/queryClient.ts";
import { useQuery } from "@tanstack/react-query";
import type { PrintQueueItem } from "shared/browser";

export function MyPrintsView() {
  const { userUuid } = useUser();

  const { data, isLoading } = useQuery({
    queryKey: ["my-prints", userUuid],
    queryFn: () => kyClient(`/api/users/${userUuid}/prints`).json<PrintQueueItem[]>(),
  });

  return <PrintQueueList printQueue={data ?? []} isLoading={isLoading} header="My Print Requests" />;
}
