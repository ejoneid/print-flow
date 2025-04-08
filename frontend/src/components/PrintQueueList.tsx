import { PrintQueueItem, type PrintQueueItemType } from "@/components/PrintQueueItem.tsx";

const mockPrintQueue: PrintQueueItemType[] = [
  {
    id: "1",
    name: "Smartphone Stand",
    requester: "John Doe",
    modelLink: "https://example.com/model1",
    materials: [{ type: "PLA", color: "Black" }],
    status: "approved",
    requestDate: "2023-11-10",
    completionDate: "2023-11-12",
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    name: "Desk Organizer",
    requester: "Jane Smith",
    modelLink: "https://example.com/model2",
    materials: [
      { type: "PETG", color: "Blue" },
      { type: "TPU", color: "Red" },
    ],
    status: "pending",
    requestDate: "2023-11-14",
    completionDate: null,
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    name: "Mechanical Keyboard Keycap",
    requester: "Alex Johnson",
    modelLink: "https://example.com/model3",
    materials: [{ type: "ABS", color: "White" }],
    status: "printing",
    requestDate: "2023-11-13",
    completionDate: null,
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "4",
    name: "Plant Pot",
    requester: "Sam Wilson",
    modelLink: "https://example.com/model4",
    materials: [{ type: "PLA", color: "Green" }],
    status: "rejected",
    requestDate: "2023-11-09",
    completionDate: null,
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
];

export function PrintQueueList() {
  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Current Queue</h2>
        <div className="text-sm text-muted-foreground">{mockPrintQueue.length} items in queue</div>
      </div>

      <div className="grid gap-4">
        {mockPrintQueue.map((item) => (
          <PrintQueueItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
