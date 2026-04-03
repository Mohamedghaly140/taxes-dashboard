"use client";

import { LucideChevronLeft, LucideChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LIMIT_OPTIONS = [5, 10, 15, 20, 25];

type UsersPaginationProps = {
  page: number;
  pageCount: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

export function UsersPagination({
  page,
  pageCount,
  limit,
  total,
  onPageChange,
  onLimitChange,
}: UsersPaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>{total === 0 ? "No results" : `${start}–${end} of ${total}`}</span>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows</span>
          <Select
            value={String(limit)}
            onValueChange={(val) => onLimitChange(Number(val))}
          >
            <SelectTrigger size="sm" className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LIMIT_OPTIONS.map((n) => (
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
            onClick={() => onPageChange(page - 1)}
          >
            <LucideChevronLeft className="size-4" />
          </Button>
          <span className="text-sm">{page} / {pageCount || 1}</span>
          <Button
            variant="outline"
            size="icon"
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            <LucideChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
