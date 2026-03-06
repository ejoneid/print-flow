import ky from "ky";
import type { PrintCoreService, PrinterStatus } from "./printCoreService";

export class PrintCoreServiceImpl implements PrintCoreService {
  async getPrinterStatus(): Promise<PrinterStatus> {
    const status = await ky.get<PrinterStatus>(`${process.env.PRINT_CORE_HOST}/printer/status`);
    return await status.json();
  }
}
