"use client";

import { ColumnDef } from "@tanstack/react-table";
import { LucideArrowUpDown, LucidePencil, LucideTrash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import type { UserWithCount } from "../types";


export const createColumns = (
  currentUserId: string,
  onEdit: (user: UserWithCount) => void,
  onDelete: (id: string) => void,
  deletingId: string | null
): ColumnDef<UserWithCount>[] => [
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
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant={row.original.role === "ADMIN" ? "destructive" : "secondary"}>
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "ACTIVE" ? "default" : "outline"}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },
  {
    id: "customers",
    header: "Customers",
    cell: ({ row }) => row.original._count.customers,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const isSelf = user.id === currentUserId;
      const isDeleting = deletingId === user.id;

      if (isSelf) return null;

      return (
        <ActionCell
          user={user}
          isDeleting={isDeleting}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    },
  },
];

function ActionCell({
  user,
  isDeleting,
  onEdit,
  onDelete,
}: {
  user: UserWithCount;
  isDeleting: boolean;
  onEdit: (u: UserWithCount) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" onClick={() => onEdit(user)}>
        <LucidePencil className="size-4" />
      </Button>
      <ConfirmDialog
        title="Delete user?"
        description={`"${user.name}" and all their customers will be permanently deleted. This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => onDelete(user.id)}
        trigger={
          <Button variant="ghost" size="icon" disabled={isDeleting}>
            {isDeleting ? (
              <Spinner />
            ) : (
              <LucideTrash2 className="size-4 text-destructive" />
            )}
          </Button>
        }
      />
    </div>
  );
}
