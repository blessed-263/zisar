"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type Icon, GraduationCap, Handshake as HeartHandshake, Tray as Inbox, MapPin, ChatCircle as MessageCircle, Scales as Scale, ShieldCheck, UserCircle as UserRound, CheckSquare as Vote } from "@phosphor-icons/react";
import { AuthCard } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { ROLES } from "@/lib/constants";
import { useDemo } from "@/lib/store";
import type { Role } from "@/lib/types";

const ICONS: Record<Role, Icon> = {
  student: GraduationCap,
  applicant: UserRound,
  rep: MessageCircle,
  verifier: Inbox,
  appeals: Scale,
  welfare: HeartHandshake,
  coordinator: MapPin,
  executive: ShieldCheck,
  officer: Vote,
};

function safeNext(raw: string | null): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

export default function SignInPage() {
  return (
    <React.Suspense fallback={null}>
      <SignInInner />
    </React.Suspense>
  );
}

function SignInInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const signIn = useDemo((s) => s.signIn);
  const [email, setEmail] = React.useState("tendai.moyo@example.com");
  const [password, setPassword] = React.useState("demo-password");
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);

  function enter(role: Role) {
    signIn(role);
    const st = useDemo.getState();
    const me = st.data.students.find((s) => s.id === "st-1");
    if (role === "student" && me && !me.onboarded) {
      router.push("/welcome");
      return;
    }
    if (next) {
      router.push(next);
      return;
    }
    router.push(role === "executive" ? "/admin/analytics" : "/home");
  }

  return (
    <>
      <AuthCard title="Sign in to the student portal">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.includes("@")) return setError("Enter the email you registered with.");
            if (!password) return setError("Enter your password.");
            setError(undefined);
            setLoading(true);
            setTimeout(() => enter("student"), 350);
          }}
          noValidate
        >
          <Field label="Email" error={error && !email.includes("@") ? error : undefined}>
            <Input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Password" error={error && email.includes("@") ? error : undefined}>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Button type="submit" variant="primary" loading={loading} className="w-full">
            Sign in
          </Button>
          <div className="flex items-center justify-between text-[14px]">
            <Link href="/sign-up" className="font-medium text-accent hover:underline">
              Create account
            </Link>
            <Link href="/forgot-password" className="text-muted hover:text-text hover:underline">
              Forgot password
            </Link>
          </div>
        </form>
      </AuthCard>

      <section aria-labelledby="demo-roles" className="mt-10 w-full max-w-3xl">
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="rounded-[6px] border border-dashed border-muted/60 px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wide text-muted uppercase">
            Demo
          </span>
          <h2 id="demo-roles" className="text-[14px] font-medium text-muted">
            Or enter as one of the seven roles
          </h2>
        </div>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {ROLES.map((r) => {
            const Icon = ICONS[r.role];
            return (
              <li key={r.role} className={r.role === "student" ? "col-span-2 sm:col-span-1" : undefined}>
                <button
                  type="button"
                  onClick={() => enter(r.role)}
                  className="flex h-full w-full flex-col gap-2 rounded-[14px] border border-border bg-surface/90 p-3.5 text-left shadow-[var(--shadow-card)] backdrop-blur transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-float)]"
                >
                  <Icon className="size-5 text-accent" aria-hidden />
                  <span className="flex flex-col">
                    <span className="font-medium">{r.label}</span>
                    <span className="t-small text-muted">{r.actor}</span>
                  </span>
                  <span className="text-[12px] leading-4 text-muted">{r.description}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="t-small mx-auto mt-4 max-w-lg text-center text-muted">
          This is a clickable prototype. Every name and document is sample data, and changes are saved only in this
          browser.
        </p>
      </section>
    </>
  );
}
