import { Separator } from "@/components/ui/separator";
import { url } from "inspector";
import { useState } from "react";
import { getEntries, type PrintFlowS3File } from "shared/browser";
import { ActiveUploads, type UploadItem } from "./ActiveUploads";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { FailedUploads } from "./FailedUploads";
import { UploadDropzone } from "./UploadDropzone";
import { UploadedFiles } from "./UploadedFiles";

interface FileManagerProps {
  requestPresignedUrls: (fileNames: string[]) => Promise<{ [key in string]: string }>;
  files: PrintFlowS3File[];
  isFetching: boolean;
  onUploadComplete: (file: PrintFlowS3File) => void;
  deleteUploadByName?: (name: string) => void;
  downloadUploadByName?: (name: string) => void;
}

export default function FileManager({
  requestPresignedUrls,
  files,
  isFetching,
  onUploadComplete,
  deleteUploadByName,
  downloadUploadByName,
}: FileManagerProps) {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  const uploadToS3 = (file: File, url: string, onProgress: (percent: number) => void) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Upload failed"));
      xhr.send(file);
    });
  };

  const startUpload = async (file: File, uploadUrl: string) => {
    const id = crypto.randomUUID();

    setUploads((prev) => [
      ...prev,
      {
        id,
        name: file.name,
        progress: 0,
        status: "uploading",
      },
    ]);

    try {
      await uploadToS3(file, uploadUrl, (progress) => {
        setUploads((prev) => prev.map((item) => (item.id === id ? { ...item, progress } : item)));
      });

      setUploads((prev) =>
        prev.map((item) => (item.id === id ? { ...item, progress: 100, status: "completed" } : item)),
      );
    } catch (error) {
      setUploads((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "error",
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : item,
        ),
      );
    }
  };

  const handleFilesSelected = async (fileList: FileList) => {
    const files = Array.from(fileList);
    const urlMap = await requestPresignedUrls(files.map((file) => file.name));
    files.forEach((file) => {
      void startUpload(file, urlMap[file.name]!);
    });
  };

  const handleDeleteClick = (fileName: string) => {
    setFileToDelete(fileName);
  };

  const confirmDelete = () => {
    if (fileToDelete && deleteUploadByName) {
      deleteUploadByName(fileToDelete);
    }
    setFileToDelete(null);
  };

  const cancelDelete = () => {
    setFileToDelete(null);
  };

  const activeUploads = uploads.filter((file) => file.status === "uploading");
  const failedUploads = uploads.filter((file) => file.status === "error");

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-y-6">
      <UploadDropzone onFilesSelected={handleFilesSelected} />

      <ActiveUploads uploads={activeUploads} onDelete={deleteUploadByName ? handleDeleteClick : undefined} />
      {activeUploads.length > 0 && files.length > 0 && <Separator className="my-0" />}
      <UploadedFiles
        files={files}
        isFetching={isFetching}
        onDelete={deleteUploadByName ? handleDeleteClick : undefined}
        onDownload={downloadUploadByName}
      />
      <FailedUploads uploads={failedUploads} onDelete={deleteUploadByName ? handleDeleteClick : undefined} />

      <DeleteConfirmDialog fileName={fileToDelete} onConfirm={confirmDelete} onCancel={cancelDelete} />
    </div>
  );
}
