import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteConfirmDialogProps {
  fileName: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmDialog({ fileName, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  return (
    <Dialog open={fileName !== null} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-[90vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete file?</DialogTitle>
          <DialogDescription className="break-all">
            Are you sure you want to delete <span className="font-medium text-foreground">{fileName}</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3 sm:flex-row flex-col-reverse">
          <Button variant="outline" onClick={onCancel} className="min-h-[44px]">
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="min-h-[44px]">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
