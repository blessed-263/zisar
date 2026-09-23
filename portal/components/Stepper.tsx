"use client";

import { Check, WarningCircle as AlertCircle } from "@phosphor-icons/react";
import type { SectionStatus } from "@/lib/selectors";
import { cn } from "@/lib/utils";

export function Stepper({
  sections,
  active,
  onSelect,
}: {
  sections: SectionStatus[];
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <ol className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-col lg:gap-0.5 lg:overflow-visible">
      {sections.map((s, i) => {
        const isActive = s.id === active;
        return (
          <li key={s.id} className="shrink-0">
            <button
              type="button"
              onClick={() => onSelect(s.id)}
              aria-current={isActive ? "step" : undefined}
              className={cn(
                "flex h-11 items-center gap-3 rounded-[10px] px-3 text-left transition-colors duration-150 lg:w-full",
                isActive ? "bg-accent-soft text-text" : "text-muted hover:bg-surface-muted hover:text-text",
              )}
            >
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full text-[12px] font-semibold",
                  s.state === "complete" && "bg-success text-white dark:text-[#0b0b0c]",
                  s.state === "missing" && "bg-warning-soft text-warning",
                  s.state === "not-started" && "border border-border bg-surface text-muted",
                )}
              >
                {s.state === "complete" ? (
                  <Check className="size-3.5" aria-hidden />
                ) : s.state === "missing" ? (
                  <AlertCircle className="size-3.5" aria-hidden />
                ) : (
                  i + 1
                )}
              </span>
              <span className="flex flex-col">
                <span className={cn("text-[14px] font-medium leading-5", isActive && "text-text")}>{s.title}</span>
                <span className="text-[12px] leading-4 text-muted">
                  {s.state === "complete"
                    ? "Complete"
                    : s.state === "missing"
                      ? `${s.missing.length} missing${s.required ? ", required" : ""}`
                      : "Not started"}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
