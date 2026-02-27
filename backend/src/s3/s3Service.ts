import { s3 } from "bun";
import type { PrintFlowS3File } from "shared/browser";

class S3Service {
  async getPrintFiles(printUuid: UUID): Promise<PrintFlowS3File[]> {
    const prefix = `prints/${printUuid}/`;
    const files = await s3.list({ prefix });
    return (
      files.contents?.map((file) => ({
        name: file.key.substring(prefix.length),
        size: file.size,
        lastModified: file.lastModified,
      })) ?? []
    );
  }

  getDownloadUrlForPrintFile(printUuid: UUID, fileName: string): string {
    return s3.presign(`prints/${printUuid}/${fileName}`, {
      method: "GET",
      expiresIn: 10 * 60,
      type: "application/json",
    });
  }

  getUploadUrlForPrintFile(printUuid: UUID, fileName: string): string {
    return s3.presign(`prints/${printUuid}/${fileName}`, {
      method: "PUT",
      expiresIn: 10 * 60,
      type: "application/json",
    });
  }

  async deletePrintFile(printUuid: UUID, fileName: string): Promise<void> {
    await s3.delete(`prints/${printUuid}/${fileName}`);
  }
}

export const s3Service = new S3Service();
