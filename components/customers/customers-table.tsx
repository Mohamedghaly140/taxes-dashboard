"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import { deleteCustomer } from "@/actions/customer.actions";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CustomerModal } from "./customer-modal";
import type { Customer } from "@/generated/prisma/client";

export function CustomersTable({ customers: initial }: { customers: Customer[] }) {
  const [customers, setCustomers] = useState(initial);
  const [editTarget, setEditTarget] = useState<Customer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleAdd() {
    setEditTarget(null);
    setModalOpen(true);
  }

  function handleEdit(customer: Customer) {
    setEditTarget(customer);
    setModalOpen(true);
  }

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteCustomer(id);
      if (result?.error) {
        toast.error("Failed to delete customer");
      } else {
        setCustomers((prev) => prev.filter((c) => c.id !== id));
        toast.success("Customer deleted");
      }
      setDeletingId(null);
    });
  }

  function handleSaved(customer: Customer) {
    setCustomers((prev) => {
      const exists = prev.find((c) => c.id === customer.id);
      return exists
        ? prev.map((c) => (c.id === customer.id ? customer : c))
        : [customer, ...prev];
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAdd} size="sm">
          <Plus className="size-4 mr-2" /> Add Customer
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>File No.</TableHead>
              <TableHead>Tax Reg. No.</TableHead>
              <TableHead>National ID</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No customers yet. Add your first one.
                </TableCell>
              </TableRow>
            )}
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.fileNumber}</TableCell>
                <TableCell>{customer.taxRegistrationNumber}</TableCell>
                <TableCell>{customer.nationalId}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(customer)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(customer.id)}
                      disabled={deletingId === customer.id}
                    >
                      {deletingId === customer.id ? (
                        <Spinner />
                      ) : (
                        <Trash2 className="size-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CustomerModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        customer={editTarget}
        onSaved={handleSaved}
      />
    </div>
  );
}
