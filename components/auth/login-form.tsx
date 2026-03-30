"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/actions/auth.actions";
import { EMPTY_ACTION_STATE } from "@/components/shared/form/utils/to-action-state";
import Form from "@/components/shared/form/form";
import FormControl from "@/components/shared/form-control";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [actionState, formAction, isPending] = useActionState(
    login,
    EMPTY_ACTION_STATE
  );

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
      </div>

      <Form action={formAction} actionState={actionState} className="space-y-4">
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

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Signing in…" : "Sign in"}
        </Button>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium underline underline-offset-4">
          Register
        </Link>
      </p>
    </div>
  );
}
