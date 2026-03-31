"use client";

import { ColumnDef } from "@tanstack/react-table";
import { LucideArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/generated/prisma/client";

export const createColumns = (
  onEdit: (customer: Customer) => void,
  onDelete: (id: string) => void,
  deletingId: string | null
): ColumnDef<Customer>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name <LucideArrowUpDown className="ml-2 size-3" />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email <LucideArrowUpDown className="ml-2 size-3" />
      </Button>
    ),
  },
  {
    accessorKey: "fileNumber",
    header: "File No.",
  },
  {
    accessorKey: "taxRegistrationNumber",
    header: "Tax Reg. No.",
  },
  {
    accessorKey: "nationalId",
    header: "National ID",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;
      const isDeleting = deletingId === customer.id;

      return (
        <ActionCell
          customer={customer}
          isDeleting={isDeleting}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];

import { LucidePencil, LucideTrash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

function ActionCell({
  customer,
  isDeleting,
  onEdit,
  onDelete,
}: {
  customer: Customer;
  isDeleting: boolean;
  onEdit: (c: Customer) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" onClick={() => onEdit(customer)}>
        <LucidePencil className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(customer.id)}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Spinner />
        ) : (
          <LucideTrash2 className="size-4 text-destructive" />
        )}
      </Button>
    </div>
  );
}
