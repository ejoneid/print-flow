import { QUERIES } from "@/queries";
import { kyClient, queryClient } from "@/queryClient";
import { useMutation } from "@tanstack/react-query";
import type { PrintStatus } from "shared/browser";

export const usePrintStatusMutation = () =>
  useMutation({
    mutationFn: async ({ printUuid, status }: { printUuid: string; status: PrintStatus }) => {
      await kyClient.put(`/api/print-queue/${printUuid}/status`, { json: { status } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERIES.queue.queryKey });
      queryClient.invalidateQueries({ queryKey: ["my-prints"] });
    },
  });
