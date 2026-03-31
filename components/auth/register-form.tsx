"use client";

import { useActionState } from "react";
import Link from "next/link";
import { register as registerAction } from "@/actions/auth.actions";
import { EMPTY_ACTION_STATE } from "@/components/shared/form/utils/to-action-state";
import Form from "@/components/shared/form/form";
import FormControl from "@/components/shared/form-control";
import SubmitButton from "@/components/shared/submit-button";

export function RegisterForm() {
  const [actionState, formAction] = useActionState(
    registerAction,
    EMPTY_ACTION_STATE
  );

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="text-sm text-muted-foreground">Fill in the details below to get started</p>
      </div>

      <Form action={formAction} actionState={actionState} className="space-y-4">
        <FormControl
          label="Name"
          name="name"
          type="text"
          placeholder="Your name"
          defaultValue={actionState.payload?.["name"]}
          actionState={actionState}
        />
        <FormControl
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          defaultValue={actionState.payload?.["email"]}
          actionState={actionState}
        />
        <FormControl
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          actionState={actionState}
        />

        <SubmitButton label="Create account" className="w-full" />
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
