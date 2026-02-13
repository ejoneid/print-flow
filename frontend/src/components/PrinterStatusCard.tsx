import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Printer, Thermometer, Wifi } from "lucide-react";
import type { PrinterStatus } from "shared/browser";

interface PrinterStatusCardProps {
  status: PrinterStatus;
}

export function PrinterStatusCard({ status }: PrinterStatusCardProps) {
  const getStatusColor = (printerStatus: PrinterStatus["status"]) => {
    switch (printerStatus) {
      case "IDLE":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "PREPARE":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "RUNNING":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "PAUSE":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "FINISH":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "FAILED":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "UNKNOWN":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const formatStatus = (printerStatus: PrinterStatus["status"]) => {
    return printerStatus.charAt(0) + printerStatus.slice(1).toLowerCase();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
            <Printer className="h-5 w-5 md:h-6 md:w-6" />
            Printer Status
          </CardTitle>
          <Badge className={`${getStatusColor(status.status)} border`}>{formatStatus(status.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <div className="rounded-full bg-orange-500/10 p-3">
              <Thermometer className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Temperature</p>
              <p className="text-2xl font-semibold">{status.temperature}°C</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border p-4">
            <div className="rounded-full bg-blue-500/10 p-3">
              <Wifi className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">WiFi Network</p>
              <p className="text-lg font-semibold truncate">{status.wifi}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
