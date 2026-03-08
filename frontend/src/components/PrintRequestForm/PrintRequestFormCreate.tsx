import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { type FormValues, PrintRequestForm } from "@/components/PrintRequestForm/PrintRequestForm.tsx";
import { kyClient } from "@/queryClient.ts";
import { globalEventEmitter } from "@/utils/eventEmitter.ts";

export function PrintRequestFormCreate() {
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      await kyClient.post("/api/prints", {
        body: JSON.stringify(values),
      });
    },
    onSuccess: () => {
      globalEventEmitter.emit("print-request-created");
      toast.success("Print request created");
    },
    onError: (error) => {
      toast.error("Could not create request", {
        description: error.message,
      });
    },
  });

  return <PrintRequestForm onSubmit={mutate} isSubmitting={isPending} />;
}
