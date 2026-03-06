import type { PrinterStatusEnum } from "shared/browser";
import { PrintCoreServiceImpl } from "./printCoreServiceImpl";
import { PrintCoreServiceMock } from "./printCoreServiceMock";

export interface PrintCoreService {
  getPrinterStatus: () => Promise<PrinterStatus>;
}

export const printCoreService: PrintCoreService =
  process.env.USE_MOCK_PRINT_CORE === "true" ? new PrintCoreServiceMock() : new PrintCoreServiceImpl();

export type PrinterStatus = {
  status: PrinterStatusEnum;
  temperature: number;
  wifi: string;
};
