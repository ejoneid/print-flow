import { type FormValues, PrintRequestForm } from "@/components/PrintRequestForm/PrintRequestForm.tsx";
import { useMutation } from "@tanstack/react-query";
import { requestHeaders } from "@/queryClient.ts";

export function PrintRequestFormCreate() {
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      await fetch("/api/print-queue", {
        headers: requestHeaders,
        method: "POST",
        body: JSON.stringify(values),
      });
    },
  });
  return <PrintRequestForm onSubmit={mutate} isSubmitting={isPending} />;
}
