"use client";

import Link from "next/link";
import { Compass } from "@phosphor-icons/react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-md flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-surface-muted text-muted">
        <Compass className="size-7" aria-hidden />
      </span>
      <h1 className="t-title">This page does not exist</h1>
      <p className="text-muted">The link may be old, or the page moved. Your data is safe.</p>
      <Link
        href="/home"
        className="inline-flex h-11 items-center rounded-[8px] bg-accent px-4 font-medium text-accent-contrast hover:bg-accent-hover"
      >
        Go to your home page
      </Link>
    </div>
  );
}
