import { PrintQueueList } from "@/components/PrintQueueList.tsx";
import { useUser } from "@/hooks/useUser.tsx";
import { QUERIES } from "@/queries";
import { useQuery } from "@tanstack/react-query";

export function MyPrintsView() {
  const { userUuid } = useUser();

  const { data, isLoading } = useQuery(QUERIES.userPrints({ userUuid }));

  return <PrintQueueList printQueue={data ?? []} isLoading={isLoading} header="My Print Requests" />;
}
