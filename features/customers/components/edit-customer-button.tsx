"use client";

import { useState } from "react";
import { LucidePencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerModal } from "./customer-modal";
import type { Customer } from "@/generated/prisma/client";

type EditCustomerButtonProps = {
  customer: Customer;
};

export function EditCustomerButton({ customer }: EditCustomerButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <LucidePencil className="size-4 mr-2" />
        Edit
      </Button>
      <CustomerModal open={open} onOpenChange={setOpen} customer={customer} />
    </>
  );
}
