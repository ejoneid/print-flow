import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { FileItem } from "./FileItem";

export interface UploadItem {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

interface ActiveUploadsProps {
  uploads: UploadItem[];
  onDelete?: (fileName: string) => void;
}

export function ActiveUploads({ uploads, onDelete }: ActiveUploadsProps) {
  if (uploads.length === 0) return null;

  return (
    <div>
      <h2 className="text-balance text-foreground text-lg flex items-center font-mono font-normal uppercase sm:text-xs mb-4">
        <Loader2 className="size-4 mr-1 animate-spin" />
        Uploading
      </h2>
      <div className="-mt-2 divide-y">
        {uploads.map((file) => (
          <FileItem key={file.id} fileName={file.name} onDelete={onDelete ? () => onDelete(file.name) : undefined}>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground text-sm tabular-nums">{file.progress}%</span>
            </div>
            <Progress value={file.progress} className="mt-1 h-2 min-w-64" />
          </FileItem>
        ))}
      </div>
    </div>
  );
}
