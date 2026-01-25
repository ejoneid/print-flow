import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePrintStatusMutation } from "@/hooks/useApprovalMutation";
import { formatPrintStatus } from "@/utils/formatters";
import { CheckCircle, Clock, Printer, XCircle } from "lucide-react";
import type { PrintStatus } from "shared/browser";

type PrintStatusBadgeProps = {
  printUuid: UUID;
  status: PrintStatus;
  isAdmin?: boolean;
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  approved: "bg-green-100 text-green-800 hover:bg-green-100",
  printing: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  completed: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  rejected: "bg-red-100 text-red-800 hover:bg-red-100",
};

const statusIcons = {
  pending: <Clock className="h-4 w-4 mr-1" />,
  approved: <CheckCircle className="h-4 w-4 mr-1" />,
  printing: <Printer className="h-4 w-4 mr-1" />,
  completed: <CheckCircle className="h-4 w-4 mr-1" />,
  rejected: <XCircle className="h-4 w-4 mr-1" />,
};

const allStatuses: PrintStatus[] = ["pending", "approved", "printing", "completed", "rejected"];

export function PrintStatusBadge({ printUuid, status, isAdmin = false }: PrintStatusBadgeProps) {
  const { mutate } = usePrintStatusMutation();
  const handleUpdate = (newStatus: PrintStatus) => {
    mutate({ printUuid, status: newStatus });
  };

  const badgeContent = (
    <Badge className={statusColors[status]} variant="outline">
      {statusIcons[status]}
      {formatPrintStatus(status)}
    </Badge>
  );

  if (!isAdmin) {
    return badgeContent;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer w-fit">{badgeContent}</div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom" className="min-w-[160px]">
        {allStatuses.map((statusOption) => (
          <DropdownMenuItem
            key={statusOption}
            onClick={() => {
              handleUpdate(statusOption);
            }}
            className="flex items-center"
          >
            {statusIcons[statusOption]}
            {formatPrintStatus(statusOption)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
