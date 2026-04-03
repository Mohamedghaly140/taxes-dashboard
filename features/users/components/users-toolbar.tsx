"use client";

import { LucidePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UsersToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
};

export function UsersToolbar({ search, onSearchChange, onAdd }: UsersToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <Input
        placeholder="Filter by name or email..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs"
      />
      <Button onClick={onAdd} size="sm">
        <LucidePlus className="size-4 mr-2" /> Add User
      </Button>
    </div>
  );
}
