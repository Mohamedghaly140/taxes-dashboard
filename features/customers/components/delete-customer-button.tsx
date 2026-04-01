"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LucideTrash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { deleteCustomer } from "../actions";

type DeleteCustomerButtonProps = {
  id: string;
  name: string;
};

export function DeleteCustomerButton({ id, name }: DeleteCustomerButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteCustomer(id);
      if (result.status === "ERROR") {
        toast.error(result.message || "Failed to delete customer");
      } else {
        toast.success(result.message);
        router.push("/dashboard/customers");
      }
    });
  }

  return (
    <ConfirmDialog
      title="Delete customer?"
      description={`"${name}" will be permanently deleted. This action cannot be undone.`}
      confirmLabel="Delete"
      onConfirm={handleConfirm}
      trigger={
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
          disabled={isPending}
        >
          {isPending ? <Spinner className="mr-2" /> : <LucideTrash2 className="size-4 mr-2" />}
          Delete
        </Button>
      }
    />
  );
}
