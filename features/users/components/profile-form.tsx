"use client";

import { useActionState } from "react";
import Form from "@/components/shared/form/form";
import FormControl from "@/components/shared/form-control";
import SubmitButton from "@/components/shared/submit-button";
import {
  EMPTY_ACTION_STATE,
} from "@/components/shared/form/utils/to-action-state";
import { updateProfile } from "@/features/users/actions";

type ProfileFormProps = {
  name: string;
  email: string;
};

export function ProfileForm({ name, email }: ProfileFormProps) {
  const [actionState, formAction] = useActionState(updateProfile, EMPTY_ACTION_STATE);

  return (
    <Form action={formAction} actionState={actionState} className="space-y-4">
      <FormControl
        label="Name"
        name="name"
        placeholder="Jane Doe"
        defaultValue={actionState.payload?.["name"] ?? name}
        actionState={actionState}
      />
      <FormControl
        label="Email"
        name="email"
        type="email"
        placeholder="jane@example.com"
        defaultValue={actionState.payload?.["email"] ?? email}
        actionState={actionState}
      />
      <FormControl
        label="New Password (leave blank to keep current)"
        name="password"
        type="password"
        placeholder="Min. 8 characters"
        actionState={actionState}
      />
      <div className="flex justify-end pt-2">
        <SubmitButton label="Save changes" />
      </div>
    </Form>
  );
}
