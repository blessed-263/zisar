"use client";

import Link from "next/link";
import { ShieldWarning as ShieldAlert } from "@phosphor-icons/react";
import { useDemo } from "@/lib/store";
import { can, type Area } from "@/lib/permissions";
import { roleMeta } from "@/lib/constants";
import { Button } from "./ui/button";

export function Forbidden({ rule }: { rule: string }) {
  const role = useDemo((s) => s.role);
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-surface-muted text-muted">
        <ShieldAlert className="size-7" aria-hidden />
      </span>
      <h1 className="t-title">You don’t have access to this page</h1>
      <p className="text-muted">
        You are signed in as <span className="font-medium text-text">{roleMeta(role).label}</span>.
      </p>
      <p className="rounded-[12px] border border-border bg-surface px-4 py-3 text-left text-[14px] leading-6">
        <span className="t-label mb-1 block">The rule</span>
        {rule}
      </p>
      <Button asChild variant="primary">
        <Link href="/home">Go to your home page</Link>
      </Button>
    </div>
  );
}

export function Guard({ area, children }: { area: Area; children: React.ReactNode }) {
  const role = useDemo((s) => s.role);
  const res = can(role, area);
  if (!res.ok) return <Forbidden rule={res.rule} />;
  return <>{children}</>;
}
