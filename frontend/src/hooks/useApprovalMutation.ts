import { QUERIES } from "@/queries";
import { kyClient, queryClient } from "@/queryClient";
import { useMutation } from "@tanstack/react-query";

export const useApprovalMutation = () =>
  useMutation({
    mutationFn: async (printUuid: string) => {
      await kyClient.post(`/api/print-queue/${printUuid}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERIES.queue.queryKey });
      queryClient.invalidateQueries({ queryKey: ["my-prints"] });
    },
  });
