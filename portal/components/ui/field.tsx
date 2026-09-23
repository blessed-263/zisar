"use client";

import * as React from "react";
import { WarningCircle as AlertCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const controlBase =
  "w-full rounded-[8px] border border-border bg-surface-muted/60 px-3 text-[15px] text-text transition-colors duration-150 placeholder:text-muted/70 hover:border-muted/40 focus:border-accent focus:bg-surface focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-0 aria-[invalid=true]:border-danger disabled:opacity-60";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn(controlBase, "h-11", className)} {...props} />,
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(controlBase, "min-h-24 py-2.5 leading-6", className)} {...props} />
  ),
);
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        controlBase,
        "h-11 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%2371717a%22 stroke-width=%222%22 viewBox=%220 0 24 24%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
  children: React.ReactElement<{ id?: string; "aria-invalid"?: boolean; "aria-describedby"?: string }>;
}

export function Field({ label, hint, error, required, optional, className, children }: FieldProps) {
  const id = React.useId();
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  const child = React.cloneElement(children, {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
  });
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[14px] font-medium leading-5 text-text">
        {label}
        {required && <span className="ml-1 text-muted">(required)</span>}
        {optional && <span className="ml-1 font-normal text-muted">(optional)</span>}
      </label>
      {child}
      {hint && !error && (
        <p id={`${id}-hint`} className="t-small text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="t-small flex items-center gap-1.5 text-danger">
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

export function Checkbox({
  label,
  description,
  checked,
  onChange,
  disabled,
  className,
}: {
  label: React.ReactNode;
  description?: React.ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  className?: string;
}) {
  const id = React.useId();
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-[8px] py-1.5",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-5 shrink-0 cursor-pointer rounded-[5px] border-border accent-[var(--accent)]"
      />
      <span className="flex flex-col">
        <span className="text-[15px] leading-6">{label}</span>
        {description && <span className="t-small text-muted">{description}</span>}
      </span>
    </label>
  );
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  const id = React.useId();
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <label htmlFor={id} className="flex flex-col">
        <span className="text-[15px] font-medium">{label}</span>
        {description && <span className="t-small text-muted">{description}</span>}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-7 w-12 shrink-0 rounded-full border transition-colors duration-150",
          checked ? "border-accent bg-accent" : "border-border bg-surface-muted",
          disabled && "opacity-60",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5.5 rounded-full bg-white shadow-sm transition-transform duration-150",
            checked ? "translate-x-5.5" : "translate-x-0.5",
          )}
          style={{ width: 22, height: 22 }}
        />
      </button>
    </div>
  );
}

export function RadioCards<T extends string>({
  value,
  onChange,
  options,
  name,
  columns = 1,
}: {
  value: T | undefined;
  onChange: (v: T) => void;
  options: { value: T; label: string; description?: string }[];
  name: string;
  columns?: 1 | 2 | 3;
}) {
  return (
    <div
      role="radiogroup"
      className={cn("grid gap-2", columns === 2 && "sm:grid-cols-2", columns === 3 && "sm:grid-cols-3")}
    >
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <label
            key={o.value}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-[10px] border p-3 transition-colors duration-150",
              selected ? "border-accent bg-accent-soft" : "border-border bg-surface hover:bg-surface-muted",
            )}
          >
            <input
              type="radio"
              name={name}
              checked={selected}
              onChange={() => onChange(o.value)}
              className="mt-1 size-4 accent-[var(--accent)]"
            />
            <span className="flex flex-col">
              <span className="font-medium">{o.label}</span>
              {o.description && <span className="t-small text-muted">{o.description}</span>}
            </span>
          </label>
        );
      })}
    </div>
  );
}
