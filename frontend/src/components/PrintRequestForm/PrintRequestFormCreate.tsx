import {type FormValues, PrintRequestForm} from "@/components/PrintRequestForm/PrintRequestForm.tsx";
import {useMutation} from "@tanstack/react-query";
import {kyClient} from "@/queryClient.ts";
import {toast} from "sonner";
import {globalEventEmitter} from "@/utils/eventEmitter.ts";

export function PrintRequestFormCreate() {
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      await kyClient.post("/api/print-queue", {
        body: JSON.stringify(values),
      });
    },
    onSuccess: () => {
      globalEventEmitter.emit('print-request-created')
      toast.success('Print request created')
    },
    onError: error => {
      toast.error('Could not create request', {
        description: error.message
      })
    }
  });

  return <PrintRequestForm onSubmit={mutate} isSubmitting={isPending} />;
}
