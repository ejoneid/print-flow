import { useQuery } from "@tanstack/react-query";
import { PrintQueueList } from "@/components/PrintQueueList.tsx";
import { QUERIES } from "@/queries";

export function AllPrintsView() {
  const { data, isLoading } = useQuery(QUERIES.queue);

  return <PrintQueueList printQueue={data ?? []} isLoading={isLoading} header="Current Queue" />;
}
