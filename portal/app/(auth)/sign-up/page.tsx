"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { useDemo } from "@/lib/store";

export default function SignUpPage() {
  const router = useRouter();
  const universities = useDemo((s) => s.data.universities);
  const signIn = useDemo((s) => s.signIn);
  const updateStudent = useDemo((s) => s.updateStudent);
  const [form, setForm] = React.useState({ first: "", surname: "", email: "", passport: "", uni: "", password: "" });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!form.first.trim()) err.first = "Enter your first names as they appear on your passport.";
    if (!form.surname.trim()) err.surname = "Enter your surname as it appears on your passport.";
    if (!form.email.includes("@")) err.email = "Enter an email you check often. Decisions are sent here.";
    if (!/^[A-Z]{1,2}\d{5,8}$/i.test(form.passport.trim()))
      err.passport = "Enter the passport number without spaces, for example FN123456.";
    if (!form.uni) err.uni = "Choose your university.";
    if (form.password.length < 8) err.password = "Use at least 8 characters.";
    setErrors(err);
    if (Object.keys(err).length) return;
    setLoading(true);
    setTimeout(() => {
      // The demo reuses the sample student so the rest of the walkthrough has data to show.
      updateStudent("st-1", { onboarded: false });
      signIn("student");
      router.push("/welcome");
    }, 400);
  }

  return (
    <AuthCard
      title="Create your account"
      description="Use your passport details. A verifier checks them against your documents."
    >
      <form className="flex flex-col gap-4" onSubmit={submit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First names" error={errors.first}>
            <Input autoComplete="given-name" value={form.first} onChange={set("first")} />
          </Field>
          <Field label="Surname" error={errors.surname}>
            <Input autoComplete="family-name" value={form.surname} onChange={set("surname")} />
          </Field>
        </div>
        <Field label="Email" error={errors.email}>
          <Input type="email" autoComplete="email" value={form.email} onChange={set("email")} />
        </Field>
        <Field label="Passport number" error={errors.passport} hint="Used to match files moved from the old portal.">
          <Input value={form.passport} onChange={set("passport")} className="uppercase" />
        </Field>
        <Field label="University" error={errors.uni}>
          <Select value={form.uni} onChange={set("uni")}>
            <option value="">Choose a university</option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}, {u.city}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Password" error={errors.password} hint="At least 8 characters.">
          <Input type="password" autoComplete="new-password" value={form.password} onChange={set("password")} />
        </Field>
        <Button type="submit" variant="primary" loading={loading} className="w-full">
          Create account
        </Button>
        <p className="text-center text-[14px] text-muted">
          Already registered?{" "}
          <Link href="/sign-in" className="font-medium text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
