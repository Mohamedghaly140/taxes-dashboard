"use client";

import { LucideDownload, LucidePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CustomersToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
};

export function CustomersToolbar({ search, onSearchChange, onAdd }: CustomersToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <Input
        placeholder="Filter by name..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs"
      />
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm">
          <a href="/api/customers/export" download>
            <LucideDownload className="size-4 mr-2" /> Export CSV
          </a>
        </Button>
        <Button onClick={onAdd} size="sm">
          <LucidePlus className="size-4 mr-2" /> Add Customer
        </Button>
      </div>
    </div>
  );
}
