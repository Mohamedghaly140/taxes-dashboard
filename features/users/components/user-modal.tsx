"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createUser, updateUser } from "../actions";
import { UserForm } from "./user-form";
import type { UserWithCount } from "./users-columns";

type UserModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserWithCount | null;
};

export function UserModal({ open, onOpenChange, user }: UserModalProps) {
  function handleSuccess() {
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>
        <UserForm
          key={user?.id ?? "new"}
          action={user ? updateUser : createUser}
          user={user ?? undefined}
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
