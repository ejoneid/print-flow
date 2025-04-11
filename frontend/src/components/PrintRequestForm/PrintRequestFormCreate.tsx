import { type FormValues, PrintRequestForm } from "@/components/PrintRequestForm/PrintRequestForm.tsx";
import { useMutation } from "@tanstack/react-query";
import { kyClient } from "@/queryClient.ts";

export function PrintRequestFormCreate() {
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      await kyClient.post("/api/print-queue", {
        body: JSON.stringify(values),
      });
    },
  });

  return <PrintRequestForm onSubmit={mutate} isSubmitting={isPending} />;
}
