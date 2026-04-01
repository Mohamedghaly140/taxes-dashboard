"use client";

import { flexRender, Table as TanstackTable } from "@tanstack/react-table";
import { LucideUsers, LucideSearchX } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Customer } from "@/generated/prisma/client";

type CustomersDataTableProps = {
  table: TanstackTable<Customer>;
  search: string;
  onRowClick?: (id: string) => void;
};

function EmptyState({ search }: { search: string }) {
  const hasSearch = search.trim().length > 0;

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      {hasSearch ? (
        <LucideSearchX className="size-8 text-muted-foreground/50" />
      ) : (
        <LucideUsers className="size-8 text-muted-foreground/50" />
      )}
      <p className="text-sm font-medium text-muted-foreground">
        {hasSearch ? `No results for "${search}"` : "No customers yet"}
      </p>
      <p className="text-xs text-muted-foreground/60">
        {hasSearch
          ? "Try a different name or clear the search."
          : "Add your first customer to get started."}
      </p>
    </div>
  );
}

export function CustomersDataTable({ table, search, onRowClick }: CustomersDataTableProps) {
  const colSpan = table.getVisibleLeafColumns().length;

  return (
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
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={colSpan} className="p-0">
                <EmptyState search={search} />
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => onRowClick?.(row.original.id)}
                className={onRowClick ? "cursor-pointer" : undefined}
              >
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
  );
}
