"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createCustomer, updateCustomer } from "@/actions/customer.actions";
import { customerSchema, type CustomerFormValues } from "@/lib/validations/customer.schema";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Customer } from "@/generated/prisma/client";

interface CustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onSaved: (customer: Customer) => void;
}

export function CustomerModal({ open, onOpenChange, customer, onSaved }: CustomerModalProps) {
  const [isPending, startTransition] = useTransition();
  const isEditing = !!customer;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
  });

  useEffect(() => {
    if (open) {
      reset(
        customer
          ? {
              name: customer.name,
              email: customer.email,
              emailPassword: customer.emailPassword ?? undefined,
              username: customer.username ?? undefined,
              fileNumber: customer.fileNumber,
              taxRegistrationNumber: customer.taxRegistrationNumber,
              nationalId: customer.nationalId,
            }
          : {}
      );
    }
  }, [open, customer, reset]);

  function onSubmit(values: CustomerFormValues) {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v !== undefined) formData.set(k, v);
      });

      const result = isEditing
        ? await updateCustomer(customer.id, formData)
        : await createCustomer(formData);

      if (result?.error) {
        const errs = result.error as Record<string, string[]>;
        if (errs.form) {
          toast.error(errs.form[0]);
        } else {
          (Object.keys(errs) as (keyof CustomerFormValues)[]).forEach((field) => {
            setError(field, { message: errs[field]?.[0] });
          });
          toast.error("Please fix the errors below");
        }
        return;
      }

      if (result.customer) onSaved(result.customer);
      toast.success(isEditing ? "Customer updated" : "Customer added");
      onOpenChange(false);
    });
  }

  const fields: { name: keyof CustomerFormValues; label: string; placeholder: string; type?: string }[] = [
    { name: "name", label: "Name", placeholder: "Acme Corp" },
    { name: "email", label: "Email", placeholder: "billing@acme.com", type: "email" },
    { name: "emailPassword", label: "Email Password", placeholder: "Optional", type: "password" },
    { name: "username", label: "Portal Username", placeholder: "Optional" },
    { name: "fileNumber", label: "File Number", placeholder: "FN-2024-001" },
    { name: "taxRegistrationNumber", label: "Tax Reg. No.", placeholder: "9 digits" },
    { name: "nationalId", label: "National ID", placeholder: "14 digits" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Customer" : "Add Customer"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {fields.map(({ name, label, placeholder, type }) => (
            <div key={name} className="space-y-1">
              <label htmlFor={name} className="text-sm font-medium">{label}</label>
              <Input
                id={name}
                type={type ?? "text"}
                placeholder={placeholder}
                {...register(name)}
                aria-invalid={!!errors[name]}
              />
              {errors[name] && (
                <p className="text-sm text-destructive">{errors[name]?.message}</p>
              )}
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : isEditing ? "Save changes" : "Add customer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
