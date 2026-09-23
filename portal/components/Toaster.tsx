"use client";

import { Check, X } from "@phosphor-icons/react";
import { useToasts } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismiss } = useToasts();
  return (
    <div
      aria-live="polite"
      data-print="hide"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(76px+env(safe-area-inset-bottom))] z-[60] flex flex-col items-center gap-2 px-4 md:bottom-6"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="anim-scale pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-[12px] bg-[#18181b] px-4 py-3 text-[14px] text-white shadow-[var(--shadow-float)] dark:bg-[#f4f4f5] dark:text-[#18181b]"
        >
          {t.tone === "success" && <Check className="size-4 shrink-0 text-[#4ade80] dark:text-[#15803d]" aria-hidden />}
          <span className="flex-1">{t.message}</span>
          {t.undo && (
            <button
              type="button"
              onClick={() => {
                t.undo?.();
                dismiss(t.id);
              }}
              className="rounded-[6px] px-2 py-1 font-semibold text-[#c7d0f7] hover:bg-white/10 dark:text-[#243891] dark:hover:bg-black/5"
            >
              Undo
            </button>
          )}
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            aria-label="Dismiss"
            className={cn("grid size-7 place-items-center rounded-[6px] opacity-70 hover:opacity-100")}
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      ))}
    </div>
  );
}
