import { CheckCircle, Loader2 } from "lucide-react";
import type { PrintFlowS3File } from "shared/browser";
import { formatFileSize, formatDate } from "@/utils/formatters";
import { FileItem } from "./FileItem";

interface UploadedFilesProps {
  files: PrintFlowS3File[];
  isFetching: boolean;
  onDelete?: (fileName: string) => void;
  onDownload?: (fileName: string) => void;
}

export function UploadedFiles({ files, isFetching, onDelete, onDownload }: UploadedFilesProps) {
  if (!isFetching && files.length === 0) return null;

  return (
    <div>
      <h2 className="text-balance text-foreground text-lg flex items-center font-mono font-normal uppercase sm:text-xs mb-4">
        {isFetching ? <Loader2 className="size-4 mr-1 animate-spin" /> : <CheckCircle className="mr-1 size-4" />}
        Uploaded Files
      </h2>
      {isFetching && files.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
          <Loader2 className="size-4 mr-2 animate-spin" />
          Loading files...
        </div>
      ) : (
        <div className="-mt-2 divide-y">
          {files.map((file) => (
            <FileItem
              key={file.name}
              fileName={file.name}
              onDelete={onDelete ? () => onDelete(file.name) : undefined}
              onDownload={onDownload ? () => onDownload(file.name) : undefined}
            >
              {(file.size !== undefined || file.lastModified !== undefined) && (
                <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                  {file.size !== undefined && <span>{formatFileSize(file.size)}</span>}
                  {file.size !== undefined && file.lastModified !== undefined && <span>•</span>}
                  {file.lastModified !== undefined && <span>{formatDate(new Date(file.lastModified).getTime())}</span>}
                </div>
              )}
            </FileItem>
          ))}
        </div>
      )}
    </div>
  );
}
