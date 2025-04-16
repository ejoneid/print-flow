import { PrintQueueItem } from "@/components/PrintQueueItem.tsx";
import type { PrintQueueItemType } from "shared/browser";

type PrintQueueListProps = {
  printQueue: PrintQueueItemType[];
};

export function PrintQueueList({ printQueue }: PrintQueueListProps) {
  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Current Queue</h2>
        <div className="text-sm text-muted-foreground">{printQueue.length} items in queue</div>
      </div>

      <div className="grid gap-4">
        {printQueue.map((item) => (
          <PrintQueueItem key={item.uuid} item={item} />
        ))}
      </div>
    </div>
  );
}
