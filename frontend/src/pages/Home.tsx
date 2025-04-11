import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import { PrintQueueList } from "@/components/PrintQueueList.tsx";
import { useQuery } from "@tanstack/react-query";
import { kyClient } from "@/queryClient.ts";
import { useUserPermissions } from "@/hooks/useUser.tsx";
import type { PrintQueueItemType } from "shared/browser";

export function HomePage() {
  const { data } = useQuery({
    queryKey: ["queue"],
    queryFn: () => kyClient("/api/print-queue").json<PrintQueueItemType[]>(),
  });
  const permissions = useUserPermissions();

  console.log(data);

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <p className="text-muted-foreground mb-4">View current print requests and their status</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link to="/request">Request a Print</Link>
          </Button>
          {permissions.approve_print && (
            <Button variant="outline" asChild>
              <Link to="/admin">Admin Panel</Link>
            </Button>
          )}
        </div>
      </div>

      <PrintQueueList printQueue={data ?? []} />
    </div>
  );
}
