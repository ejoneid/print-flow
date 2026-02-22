import FileManager from "@/components/common/FileManager/FileManager";
import { QUERIES } from "@/queries";
import { kyClient } from "@/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import ky from "ky";
import { useParams } from "react-router";

export function PrintPage() {
  const { printUuid } = useParams();
  const { data: files, isFetching } = useQuery(QUERIES.printFiles({ printUuid: printUuid as UUID }));
  const { mutateAsync: deleteFile } = useMutation({
    mutationFn: (fileName: string) => kyClient.delete(`/api/prints/${printUuid}/files`, { json: { fileName } }),
  });

  const handleDownload = async (fileName: string) => {
    const response = await kyClient.get(`/api/prints/${printUuid}/files/${fileName}`).json<{ url: string }>();

    // Fetch the file as a blob
    const fileBlob = await fetch(response.url).then((res) => res.blob());

    // Create a blob URL and trigger download
    const blobUrl = URL.createObjectURL(fileBlob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the blob URL
    URL.revokeObjectURL(blobUrl);
  };

  return (
    <div>
      <FileManager
        requestPresignedUrls={async (fileNames: string[]) => {
          const { queryFn } = QUERIES.uploadPrintFileUrls({ printUuid: printUuid as UUID, fileNames });
          const data = await queryFn();
          return data;
        }}
        files={files ?? []}
        isFetching={isFetching}
        deleteUploadByName={deleteFile}
        downloadUploadByName={handleDownload}
        onUploadComplete={() => {}}
      />
    </div>
  );
}
