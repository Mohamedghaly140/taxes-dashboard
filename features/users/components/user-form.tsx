"use client";

import { useState, useActionState } from "react";
import Form from "@/components/shared/form/form";
import FormControl from "@/components/shared/form-control";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/shared/submit-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import FieldError from "@/components/shared/form/field-error";
import {
  ActionState,
  EMPTY_ACTION_STATE,
} from "@/components/shared/form/utils/to-action-state";
import type { UserWithCount } from "./users-columns";

type UserFormProps = {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  user?: UserWithCount;
  onSuccess?: (actionState: ActionState) => void;
  onCancel?: () => void;
};

export function UserForm({ action, user, onSuccess, onCancel }: UserFormProps) {
  const [role, setRole] = useState<string>(user?.role ?? "CLIENT");
  const [status, setStatus] = useState<string>(user?.status ?? "ACTIVE");

  const [actionState, formAction] = useActionState(action, EMPTY_ACTION_STATE);

  return (
    <Form
      action={formAction}
      actionState={actionState}
      onSuccess={onSuccess}
      className="space-y-4 mt-2"
    >
      {user && <input type="hidden" name="id" value={user.id} />}
      <input type="hidden" name="role" value={role} />
      <input type="hidden" name="status" value={status} />

      <FormControl
        label="Name"
        name="name"
        placeholder="Jane Doe"
        defaultValue={actionState.payload?.["name"] ?? user?.name}
        actionState={actionState}
      />
      <FormControl
        label="Email"
        name="email"
        type="email"
        placeholder="jane@example.com"
        defaultValue={actionState.payload?.["email"] ?? user?.email}
        actionState={actionState}
      />
      <FormControl
        label={user ? "New Password (leave blank to keep current)" : "Password"}
        name="password"
        type="password"
        placeholder={user ? "Leave blank to keep current" : "Min. 8 characters"}
        actionState={actionState}
      />

      <div className="flex flex-col gap-y-2">
        <Label>Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CLIENT">CLIENT</SelectItem>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
          </SelectContent>
        </Select>
        <FieldError name="role" actionState={actionState} />
      </div>

      <div className="flex flex-col gap-y-2">
        <Label>Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">ACTIVE</SelectItem>
            <SelectItem value="INACTIVE">INACTIVE</SelectItem>
          </SelectContent>
        </Select>
        <FieldError name="status" actionState={actionState} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <SubmitButton label={user ? "Save changes" : "Add user"} />
      </div>
    </Form>
  );
}
