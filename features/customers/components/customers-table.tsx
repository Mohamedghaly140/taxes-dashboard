"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryStates } from "nuqs";
import {
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { deleteCustomer } from "../actions";
import { CustomerModal } from "./customer-modal";
import { CustomersToolbar } from "./customers-toolbar";
import { CustomersDataTable } from "./customers-data-table";
import { CustomersPagination } from "./customers-pagination";
import { createColumns } from "./columns";
import { searchParser, paginationParser } from "@/nuqs/search-params";
import type { Customer } from "@/generated/prisma/client";

type CustomersTableProps = {
  customers: Customer[];
  pageCount: number;
  total: number;
};

export function CustomersTable({
  customers,
  pageCount,
  total,
}: CustomersTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editTarget, setEditTarget] = useState<Customer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const [{ search, page, limit }, setParams] = useQueryStates(
    { search: searchParser, ...paginationParser },
    { shallow: false },
  );

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteCustomer(id);
      if (result.status === "ERROR") {
        toast.error(result.message || "Failed to delete customer");
      } else {
        toast.success(result.message);
      }
      setDeletingId(null);
    });
  }

  const columns = createColumns(
    customer => {
      setEditTarget(customer);
      setModalOpen(true);
    },
    handleDelete,
    deletingId,
  );

  const table = useReactTable({
    data: customers,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      <CustomersToolbar
        search={search}
        onSearchChange={value => setParams({ search: value, page: 1 })}
        onAdd={() => {
          setEditTarget(null);
          setModalOpen(true);
        }}
      />

      <CustomersDataTable
        table={table}
        search={search}
        onRowClick={id => router.push(`/dashboard/customers/${id}`)}
      />

      <CustomersPagination
        page={page}
        pageCount={pageCount}
        limit={limit}
        total={total}
        onPageChange={p => setParams({ page: p })}
        onLimitChange={l => setParams({ limit: l, page: 1 })}
      />

      <CustomerModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        customer={editTarget}
      />
    </div>
  );
}
