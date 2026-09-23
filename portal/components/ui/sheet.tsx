"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "md" | "lg";
}

/** Slides up from the bottom on phones and in from the right on larger screens. */
export function Sheet({ open, onOpenChange, title, description, children, footer, size = "md" }: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="anim-fade fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px]" />
        <Dialog.Content
          className={cn(
            "fixed z-50 flex flex-col bg-surface shadow-[var(--shadow-float)] focus:outline-none",
            "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-[16px] anim-sheet-up",
            "md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:rounded-none md:rounded-l-[16px] md:anim-sheet-left",
            size === "md" ? "md:w-[440px]" : "md:w-[560px]",
          )}
        >
          <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border md:hidden" aria-hidden />
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div className="flex flex-col gap-1">
              <Dialog.Title className="t-title">{title}</Dialog.Title>
              {description ? (
                <Dialog.Description className="t-small text-muted">{description}</Dialog.Description>
              ) : (
                <Dialog.Description className="sr-only">{title}</Dialog.Description>
              )}
            </div>
            <Dialog.Close
              className="-mr-2 grid size-10 place-items-center rounded-[8px] text-muted hover:bg-surface-muted hover:text-text"
              aria-label="Close"
            >
              <X className="size-5" />
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
          {footer && (
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  destructive,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  destructive?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="anim-fade fixed inset-0 z-50 bg-black/30" />
        <Dialog.Content className="anim-scale fixed top-1/2 left-1/2 z-50 w-[calc(100%-32px)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[16px] border border-border bg-surface p-5 shadow-[var(--shadow-float)] focus:outline-none">
          <Dialog.Title className="t-title">{title}</Dialog.Title>
          {description ? (
            <Dialog.Description className="mt-2 text-muted">{description}</Dialog.Description>
          ) : (
            <Dialog.Description className="sr-only">{title}</Dialog.Description>
          )}
          {children && <div className="mt-4">{children}</div>}
          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close className="inline-flex h-11 items-center rounded-[8px] border border-border px-4 font-medium hover:bg-surface-muted">
              Cancel
            </Dialog.Close>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className={cn(
                "inline-flex h-11 items-center rounded-[8px] px-4 font-medium",
                destructive
                  ? "bg-danger text-white dark:text-[#0b0b0c]"
                  : "bg-accent text-accent-contrast hover:bg-accent-hover",
              )}
            >
              {confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
