import { PrinterStatusEnum } from "shared/browser";
import type { PrintCoreService, PrinterStatus } from "./printCoreService";

export class PrintCoreServiceMock implements PrintCoreService {
  status: PrinterStatusEnum;

  constructor() {
    this.status = PrinterStatusEnum.IDLE;
  }

  async getPrinterStatus(): Promise<PrinterStatus> {
    return Promise.resolve({
      status: this.status,
      temperature: 21.15,
      wifi: "mock-wifi",
    });
  }
}
