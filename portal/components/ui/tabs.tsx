"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Tabs<T extends string>({
  value,
  onChange,
  items,
  className,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  items: { value: T; label: string; count?: number }[];
  className?: string;
  label: string;
}) {
  const refs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  function onKey(e: React.KeyboardEvent, idx: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (idx + (e.key === "ArrowRight" ? 1 : -1) + items.length) % items.length;
    onChange(items[next].value);
    refs.current[items[next].value]?.focus();
  }
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn("flex gap-1 overflow-x-auto border-b border-border [scrollbar-width:none]", className)}
    >
      {items.map((it, idx) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            ref={(el) => {
              refs.current[it.value] = el;
            }}
            role="tab"
            type="button"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onKeyDown={(e) => onKey(e, idx)}
            onClick={() => onChange(it.value)}
            className={cn(
              "relative -mb-px flex h-11 shrink-0 items-center gap-2 px-3 text-[14px] font-medium transition-colors duration-200",
              active ? "text-text" : "text-muted hover:text-text",
            )}
          >
            {it.label}
            {typeof it.count === "number" && (
              <span
                className={cn(
                  "tabular rounded-full px-1.5 text-[12px] leading-5",
                  active ? "bg-accent-soft text-accent" : "bg-surface-muted text-muted",
                )}
              >
                {it.count}
              </span>
            )}
            <span
              className={cn(
                "absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-colors duration-200",
                active ? "bg-accent" : "bg-transparent",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  items,
  label,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  items: { value: T; label: string; icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }> }[];
  label: string;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("inline-flex rounded-[10px] border border-border bg-surface-muted p-1", className)}
    >
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(it.value)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-[7px] px-3 text-[13px] font-medium transition-colors duration-150",
              active ? "bg-surface text-text shadow-sm" : "text-muted hover:text-text",
            )}
          >
            {it.icon && <it.icon className="size-4" aria-hidden />}
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
