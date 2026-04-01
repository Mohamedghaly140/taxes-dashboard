"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Customer } from "@/generated/prisma/client";
import { createCustomer, updateCustomer } from "../actions";
import { CustomerForm } from "./customer-form";

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
  function handleSuccess() {
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
