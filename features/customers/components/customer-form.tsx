"use client";

import { useActionState } from "react";
import Form from "@/components/shared/form/form";
import FormControl from "@/components/shared/form-control";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/shared/submit-button";
import {
  ActionState,
  EMPTY_ACTION_STATE,
} from "@/components/shared/form/utils/to-action-state";
import type { Customer } from "@/generated/prisma/client";

type CustomerFormProps = {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  customer?: Customer;
  onSuccess?: (actionState: ActionState) => void;
  onCancel?: () => void;
};

export function CustomerForm({
  action,
  customer,
  onSuccess,
  onCancel,
}: CustomerFormProps) {
  const [actionState, formAction] = useActionState(
    action,
    EMPTY_ACTION_STATE
  );

  return (
    <Form
      action={formAction}
      actionState={actionState}
      onSuccess={onSuccess}
      className="space-y-4 mt-2"
    >
      {customer && <input type="hidden" name="id" value={customer.id} />}

      <FormControl
        label="Name"
        name="name"
        placeholder="Acme Corp"
        defaultValue={actionState.payload?.["name"] ?? customer?.name}
        actionState={actionState}
      />
      <FormControl
        label="Email"
        name="email"
        type="email"
        placeholder="billing@acme.com"
        defaultValue={actionState.payload?.["email"] ?? customer?.email}
        actionState={actionState}
      />
      <FormControl
        label="Email Password"
        name="emailPassword"
        type="password"
        placeholder="Email password"
        defaultValue={actionState.payload?.["emailPassword"] ?? customer?.emailPassword}
        actionState={actionState}
      />
      <FormControl
        label="Portal Username"
        name="username"
        placeholder="Portal username"
        defaultValue={actionState.payload?.["username"] ?? customer?.username}
        actionState={actionState}
      />
      <FormControl
        label="Portal Password"
        name="portalPassword"
        type="password"
        placeholder="Portal password"
        defaultValue={actionState.payload?.["portalPassword"] ?? customer?.portalPassword}
        actionState={actionState}
      />
      <FormControl
        label="File Number"
        name="fileNumber"
        placeholder="FN-2024-001"
        defaultValue={
          actionState.payload?.["fileNumber"] ?? customer?.fileNumber
        }
        actionState={actionState}
      />
      <FormControl
        label="Tax Reg. No."
        name="taxRegistrationNumber"
        placeholder="9 digits"
        defaultValue={
          actionState.payload?.["taxRegistrationNumber"] ??
          customer?.taxRegistrationNumber
        }
        actionState={actionState}
      />
      <FormControl
        label="National ID"
        name="nationalId"
        placeholder="14 digits"
        defaultValue={
          actionState.payload?.["nationalId"] ?? customer?.nationalId
        }
        actionState={actionState}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <SubmitButton label={customer ? "Save changes" : "Add customer"} />
      </div>
    </Form>
  );
}
