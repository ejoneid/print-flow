import { PrintQueueList } from "@/components/PrintQueueList.tsx";
import { kyClient } from "@/queryClient.ts";
import { useQuery } from "@tanstack/react-query";
import type { PrintQueueItem } from "shared/browser";

export function AllPrintsView() {
  const { data, isLoading } = useQuery({
    queryKey: ["queue"],
    queryFn: () => kyClient("/api/print-queue").json<PrintQueueItem[]>(),
  });

  return <PrintQueueList printQueue={data ?? []} isLoading={isLoading} header="Current Queue" />;
}
