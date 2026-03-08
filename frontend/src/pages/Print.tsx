import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router";
import type { PrintStatus } from "shared/browser";
import FileManager from "@/components/common/FileManager/FileManager";
import { PrintStatusBadge } from "@/components/PrintStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserPermissions } from "@/hooks/useUser";
import { QUERIES } from "@/queries";
import { kyClient } from "@/queryClient";

export function PrintPage() {
  const { printUuid } = useParams();
  const permissions = useUserPermissions();
  const queryClient = useQueryClient();

  const { data: print, isLoading: isPrintLoading } = useQuery(QUERIES.print({ printUuid: printUuid as UUID }));
  const { data: files, isFetching } = useQuery(QUERIES.printFiles({ printUuid: printUuid as UUID }));

  const { mutateAsync: deleteFile } = useMutation({
    mutationFn: (fileName: string) => kyClient.delete(`/api/prints/${printUuid}/files/${fileName}`),
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

  const invalidateFilesQuery = () => {
    queryClient.invalidateQueries({
      queryKey: QUERIES.printFiles({ printUuid: printUuid as UUID }).queryKey,
    });
  };

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-6">
      <div className="mb-6">
        <Button variant="outline" size="sm">
          <ArrowLeft size={60} />
          <Link to="/">Back to Queue</Link>
        </Button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex-1">
          {isPrintLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ) : print ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <CardTitle className="text-xl md:text-2xl">{print.name}</CardTitle>
                    <CardDescription className="text-sm">
                      Requested on {new Date(print.requestDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <PrintStatusBadge
                    printUuid={printUuid as UUID}
                    status={print.status as PrintStatus}
                    enableEditing={permissions.approve_print}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {print.imageUrl && (
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                    <img src={print.imageUrl} alt={print.name} className="h-full w-full object-cover" />
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Model Link</h3>
                  <a
                    href={print.modelLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline break-all"
                  >
                    <ExternalLink className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-1">{print.modelLink}</span>
                  </a>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Materials</h3>
                  <div className="flex flex-wrap gap-2">
                    {print.materials.map((material) => (
                      <Badge key={`${material.type}-${material.color}`} variant="outline" className="capitalize">
                        {material.type} - {material.color}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Requested By</h3>
                  <p className="text-sm text-muted-foreground">{print.requester}</p>
                </div>

                {print.completionDate && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Completed On</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(print.completionDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="w-full lg:w-96 lg:shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Files</CardTitle>
              <CardDescription>Upload and manage files for this print</CardDescription>
            </CardHeader>
            <CardContent>
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
                onUploadComplete={invalidateFilesQuery}
                onDeleteComplete={invalidateFilesQuery}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
