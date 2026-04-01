"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryStates } from "nuqs";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { LucideChevronLeft, LucideChevronRight, LucidePlus } from "lucide-react";
import { deleteCustomer } from "../actions";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomerModal } from "./customer-modal";
import { createColumns } from "./columns";
import { searchParser, paginationParser } from "@/nuqs/search-params";
import type { Customer } from "@/generated/prisma/client";

type Props = {
  customers: Customer[];
  pageCount: number;
  total: number;
};

export function CustomersTable({ customers, pageCount, total }: Props) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editTarget, setEditTarget] = useState<Customer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const [{ search, page, limit }, setParams] = useQueryStates(
    { search: searchParser, ...paginationParser },
    { shallow: false }
  );

  function handleSearchChange(value: string) {
    setParams({ search: value, page: 1 });
  }

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
      if (result.status === "ERROR") {
        toast.error(result.message || "Failed to delete customer");
      } else {
        toast.success(result.message);
        router.refresh();
      }
      setDeletingId(null);
    });
  }

  const columns = createColumns(handleEdit, handleDelete, deletingId);

  const table = useReactTable({
    data: customers,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter by name..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={handleAdd} size="sm">
          <LucidePlus className="size-4 mr-2" /> Add Customer
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-8">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {total === 0 ? "No results" : `${start}–${end} of ${total}`}
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">Rows</span>
            <Select
              value={String(limit)}
              onValueChange={(val) => setParams({ limit: Number(val), page: 1 })}
            >
              <SelectTrigger size="sm" className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 15, 20, 25].map((n) => (
                  <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1}
              onClick={() => setParams({ page: page - 1 })}
            >
              <LucideChevronLeft className="size-4" />
            </Button>
            <span className="text-sm">
              {page} / {pageCount || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={page >= pageCount}
              onClick={() => setParams({ page: page + 1 })}
            >
              <LucideChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <CustomerModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        customer={editTarget}
      />
    </div>
  );
}
