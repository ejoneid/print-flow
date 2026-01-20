import { PrintQueueItem as PrintQueueItemComponent } from "@/components/PrintQueueItem.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import type { PrintQueueItem } from "shared/browser";

type PrintQueueListProps = {
  printQueue: PrintQueueItem[];
  isLoading: boolean;
  header?: string;
};

export function PrintQueueList({ printQueue, isLoading, header }: PrintQueueListProps) {
  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{header}</h2>
        {!isLoading && <div className="text-sm text-muted-foreground">{printQueue.length} items in queue</div>}
      </div>

      {isLoading ? (
        <LoadingState />
      ) : printQueue.length === 0 ? (
        <EmptyState header={header} />
      ) : (
        <div className="grid gap-4">
          {printQueue.map((item) => (
            <PrintQueueItemComponent key={item.uuid} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="h-12 w-12 bg-muted rounded-md" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
            <div className="h-8 w-20 bg-muted rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ header }: { header?: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-1">No print requests yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          {header === "My Print Requests"
            ? "You haven't submitted any print requests yet. Click 'Request a Print' to get started."
            : "The print queue is currently empty."}
        </p>
      </CardContent>
    </Card>
  );
}
