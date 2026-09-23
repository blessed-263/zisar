import * as React from "react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Glyph,
  title,
  action,
  className,
}: {
  icon: PhosphorIcon;
  title: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-[14px] border border-dashed border-border bg-surface/50 px-6 py-12 text-center",
        className,
      )}
    >
      <Glyph className="size-10 text-muted/70" aria-hidden />
      <p className="max-w-sm text-muted">{title}</p>
      {action}
    </div>
  );
}
