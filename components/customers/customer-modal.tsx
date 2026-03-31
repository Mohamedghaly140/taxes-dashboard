"use client";

import { useRouter } from "next/navigation";
import { createCustomer, updateCustomer } from "@/actions/customer.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomerForm } from "./customer-form";
import type { Customer } from "@/generated/prisma/client";

interface CustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
}

export function CustomerModal({
  open,
  onOpenChange,
  customer,
}: CustomerModalProps) {
  const router = useRouter();

  function handleSuccess() {
    router.refresh();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {customer ? "Edit Customer" : "Add Customer"}
          </DialogTitle>
        </DialogHeader>
        <CustomerForm
          key={customer?.id ?? "new"}
          action={customer ? updateCustomer : createCustomer}
          customer={customer ?? undefined}
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
