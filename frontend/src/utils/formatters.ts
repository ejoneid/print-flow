import type { PrintStatus } from "shared/browser";

export function formatPrintStatus(status: PrintStatus) {
  switch (status) {
    case "pending":
      return "Pending approval";
    case "approved":
      return "Approved";
    case "printing":
      return "Printing";
    case "completed":
      return "Completed";
    case "rejected":
      return "Rejected";
  }
}
