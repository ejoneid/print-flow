import ky from "ky";

export async function getPrinterStatus(): Promise<PrinterStatus> {
  const status = await ky.get<PrinterStatus>(`${process.env.PRINT_CORE_HOST}/printer/status`);
  return await status.json();
}

type PrinterStatus = {
  status: PrinterStatusEnum;
  temperature: number;
  wifi: string;
};

enum PrinterStatusEnum {
  IDLE = "IDLE",
  PREPARE = "PREPARE",
  RUNNING = "RUNNING",
  PAUSE = "PAUSE",
  FINISH = "FINISH",
  FAILED = "FAILED",
  UNKNOWN = "UNKNOWN",
}
