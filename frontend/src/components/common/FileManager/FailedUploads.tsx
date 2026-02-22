import { X } from "lucide-react";
import type { UploadItem } from "./ActiveUploads";
import { FileItem } from "./FileItem";

interface FailedUploadsProps {
  uploads: UploadItem[];
  onDelete?: (fileName: string) => void;
}

export function FailedUploads({ uploads, onDelete }: FailedUploadsProps) {
  if (uploads.length === 0) return null;

  return (
    <div>
      <h2 className="text-balance text-foreground text-lg flex items-center font-mono font-normal uppercase sm:text-xs mb-4">
        <X className="mr-1 size-4" />
        Failed
      </h2>
      <div className="-mt-2 divide-y">
        {uploads.map((file) => (
          <FileItem key={file.id} fileName={file.name} onDelete={onDelete ? () => onDelete(file.name) : undefined}>
            <span className="text-muted-foreground text-xs sm:text-[11px]">{file.error ?? "Upload failed"}</span>
          </FileItem>
        ))}
      </div>
    </div>
  );
}
