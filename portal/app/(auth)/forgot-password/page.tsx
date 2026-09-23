"use client";

import * as React from "react";
import Link from "next/link";
import { EnvelopeSimple as MailCheck } from "@phosphor-icons/react";
import { AuthCard } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [sent, setSent] = React.useState(false);

  if (sent) {
    return (
      <AuthCard title="Check your email" showLogo={false}>
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-success-soft text-success">
            <MailCheck className="size-7" aria-hidden />
          </span>
          <p className="text-muted">
            If <span className="font-medium text-text">{email}</span> has an account, a link to set a new password is
            on its way. The link works for 30 minutes.
          </p>
          <p className="t-small text-muted">In the demo, no email is sent.</p>
          <Button asChild variant="secondary" className="w-full">
            <Link href="/sign-in">Back to sign in</Link>
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Reset your password" description="Enter the email you registered with.">
      <form
        className="flex flex-col gap-4"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!email.includes("@")) return setError("Enter the email you registered with.");
          setSent(true);
        }}
      >
        <Field label="Email" error={error}>
          <Input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Button type="submit" variant="primary" className="w-full">
          Send reset link
        </Button>
        <Link href="/sign-in" className="text-center text-[14px] text-muted hover:text-text hover:underline">
          Back to sign in
        </Link>
      </form>
    </AuthCard>
  );
}
