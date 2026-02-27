import { Download, FileText, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FileItemProps {
  fileName: string;
  onDelete?: () => void;
  onDownload?: () => void;
  children?: React.ReactNode;
}

export function FileItem({ fileName, onDelete, onDownload, children }: FileItemProps) {
  const hasMenu = onDelete || onDownload;

  return (
    <div className="flex items-center gap-3 py-4">
      <div className="grid size-10 shrink-0 place-content-center rounded border bg-muted">
        <FileText className="size-4" />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between gap-2 items-center">
          <span className="select-none text-base/6 text-foreground sm:text-sm/6">{fileName}</span>
        </div>
        {children}
      </div>
      {hasMenu && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-10 shrink-0" aria-label="File menu">
              <MoreVertical className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[160px]">
            {onDownload && (
              <DropdownMenuItem onClick={onDownload} className="cursor-pointer">
                <Download className="size-4 mr-2" />
                Download
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive cursor-pointer">
                <Trash2 className="size-4 mr-2" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
