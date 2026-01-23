import type { PrintStatus } from "shared/browser";

export function formatPrintStatus(status: PrintStatus) {
  switch (status) {
    case "pending":
      return "Pending approval";
    case "approved":
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
