"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { useQueryStates } from "nuqs";
import {
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { deleteUser } from "../actions";
import { UserModal } from "./user-modal";
import { UsersToolbar } from "./users-toolbar";
import { UsersDataTable } from "./users-data-table";
import { UsersPagination } from "./users-pagination";
import { createColumns } from "./users-columns";
import { searchParser, paginationParser } from "@/nuqs/search-params";
import type { UserWithCount } from "../types";

type UsersTableProps = {
  users: UserWithCount[];
  pageCount: number;
  total: number;
  currentUserId: string;
};

export function UsersTable({ users, pageCount, total, currentUserId }: UsersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editTarget, setEditTarget] = useState<UserWithCount | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const [{ search, page, limit }, setParams] = useQueryStates(
    { search: searchParser, ...paginationParser },
    { shallow: false }
  );

  const handleDelete = useCallback(
    (id: string) => {
      setDeletingId(id);
      startTransition(async () => {
        const result = await deleteUser(id);
        if (result.status === "ERROR") {
          toast.error(result.message || "Failed to delete user");
        } else {
          toast.success(result.message);
        }
        setDeletingId(null);
      });
    },
    [startTransition]
  );

  const columns = useMemo(
    () =>
      createColumns(
        currentUserId,
        (user) => {
          setEditTarget(user);
          setModalOpen(true);
        },
        handleDelete,
        deletingId
      ),
    [deletingId, currentUserId, handleDelete]
  );

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      <UsersToolbar
        search={search}
        onSearchChange={(value) => setParams({ search: value, page: 1 })}
        onAdd={() => {
          setEditTarget(null);
          setModalOpen(true);
        }}
      />

      <UsersDataTable table={table} search={search} />

      <UsersPagination
        page={page}
        pageCount={pageCount}
        limit={limit}
        total={total}
        onPageChange={(p) => setParams({ page: p })}
        onLimitChange={(l) => setParams({ limit: l, page: 1 })}
      />

      <UserModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        user={editTarget}
      />
    </div>
  );
}
