import type { PrintQueueItem, PrintQueueItemBody, PrintQueueItemDto, PrintStatus } from "shared/browser";
import { MATERIAL_COLUMNS, PRINT_QUEUE_COLUMNS, type MaterialEntity, type PrintQueueEntity } from "../db.ts";
import { NotFoundError, UnauthorizedError } from "../errors.ts";
import { getAuthDetails } from "../security/requestContext.ts";
import { userService } from "../user/userService.ts";
import { forbiddenResponse } from "../utils/responses.ts";
import { extractType } from "../utils/typeUtils.ts";
import { getImageUrl } from "./imageUrlScraper.ts";
import {
  approvePrintStatement,
  insertTransaction,
  selectPrintByUuid as selectPrintByUuidStatement,
  selectPrintQueueStatement,
  selectUserPrintQueueStatement,
} from "./printQueueRepository.ts";

export async function getPrintQueue(): Promise<Response> {
  const authDetails = getAuthDetails();
  if (!authDetails.permissions.has("read_queue")) {
    return forbiddenResponse("User does not have permission to read print queue");
  }

  const entities = selectPrintQueueStatement.all(null);
  const result = await entitiesToPrintQueueItemDtos(entities);
  return Response.json(result satisfies PrintQueueItemDto[]);
}

export async function getPrintsForUser(userUuid: UUID): Promise<PrintQueueItemDto[]> {
  const authDetails = getAuthDetails();
  if (userUuid !== authDetails.userUuid && !authDetails.permissions.has("view_users")) {
    throw new UnauthorizedError("User does not have permission to see other users");
  }

  // @ts-expect-error
  const entities = selectUserPrintQueueStatement.all({ userUuid });
  return await entitiesToPrintQueueItemDtos(entities);
}

export async function postPrintQueue(printData: PrintQueueItemBody): Promise<void> {
  const authDetails = getAuthDetails();
  const imageUrl = await getImageUrl(printData.modelLink);
  insertTransaction(printData, imageUrl, authDetails.userUuid);
}

export async function updatePrintStatus(printUuid: UUID, status: PrintStatus): Promise<void> {
  const authDetails = getAuthDetails();
  if (!authDetails.permissions.has("approve_print")) {
    throw new UnauthorizedError("User does not have permission to approve print");
  }
  const result = approvePrintStatement.run({
    uuid: printUuid,
    status,
    status_updated_at: new Date().toISOString(),
    status_updated_by: authDetails.userUuid,
  });
  if (result.changes === 0) {
    const existingPrint = selectPrintByUuidStatement.get(printUuid);
    if (!existingPrint) {
      throw new NotFoundError("Print not found");
    }
  }
}

function joinPrintQueueAndMaterials(dbRows: (PrintQueueEntity & MaterialEntity)[]): PrintQueueItem[] {
  const rowsByItemUuid = Object.groupBy(dbRows, (item) => item.uuid);
  return Object.values(rowsByItemUuid)
    .map((itemRows) => {
      const item = extractType(itemRows![0], PRINT_QUEUE_COLUMNS, "uuid");
      if (!item) return undefined;
      const materials = itemRows!
        .map((materialRow) => extractType(materialRow, MATERIAL_COLUMNS, "print_queue_uuid"))
        .filter((material) => material !== undefined);

      return {
        uuid: item.uuid,
        name: item.name,
        status: item.status,
        requester: item.created_by,
        modelLink: item.url,
        requestDate: item.created_at,
        completionDate: item.completed_at,
        imageUrl: item.image_url,
        materials: materials.map((material) => ({
          type: material.type,
          color: material.color,
        })),
      };
    })
    .filter((item) => !!item);
}

async function entitiesToPrintQueueItemDtos(
  entities: (PrintQueueEntity & MaterialEntity)[],
): Promise<PrintQueueItemDto[]> {
  const printQueue = joinPrintQueueAndMaterials(entities);
  const requesterUuids = printQueue.map((item) => item.requester);
  const requestersMap = await userService.getUserMetaDataByIds(requesterUuids);
  return printQueue.map((item) => ({
    ...item,
    requester: requestersMap.get(item.requester)!.fullName,
  }));
}
