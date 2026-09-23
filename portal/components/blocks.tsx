"use client";

import * as React from "react";
import Link from "next/link";
import { type Icon, CaretRight as ChevronRight } from "@phosphor-icons/react";
import { cn, initials } from "@/lib/utils";
import { Button } from "./ui/button";

export function PageHeader({
  title,
  description,
  crumbs,
  actions,
  label,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  crumbs?: { href: string; label: string }[];
  actions?: React.ReactNode;
  label?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div className="flex min-w-0 flex-col gap-1.5">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="t-small hidden items-center gap-1 text-muted lg:flex">
            {crumbs.map((c, i) => (
              <React.Fragment key={c.href + i}>
                {i > 0 && <ChevronRight className="size-3.5" aria-hidden />}
                <Link href={c.href} className="hover:text-text">
                  {c.label}
                </Link>
              </React.Fragment>
            ))}
          </nav>
        )}
        {label && <span className="t-label">{label}</span>}
        <h1 className="t-display">{title}</h1>
        {description && <p className="max-w-2xl text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Avatar({
  name,
  photo,
  size = 40,
  className,
}: {
  name: string;
  photo?: string;
  size?: number;
  className?: string;
}) {
  if (photo) {
    return (
      <img
        src={photo}
        alt=""
        width={size}
        height={size}
        className={cn("shrink-0 rounded-full object-cover ring-2 ring-surface shadow-sm", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn("grid shrink-0 place-items-center rounded-full bg-accent-soft font-semibold text-accent", className)}
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.36) }}
    >
      {initials(name)}
    </span>
  );
}

export function Row({
  href,
  onClick,
  icon: Icon,
  title,
  meta,
  trailing,
  className,
}: {
  href?: string;
  onClick?: () => void;
  icon?: Icon;
  title: React.ReactNode;
  meta?: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
}) {
  const content = (
    <>
      {Icon && (
        <span className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-surface-muted text-muted">
          <Icon className="size-4.5" aria-hidden />
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-medium">{title}</span>
        {meta && <span className="t-small truncate text-muted">{meta}</span>}
      </span>
      {trailing}
      {(href || onClick) && <ChevronRight className="size-4 shrink-0 text-muted" aria-hidden />}
    </>
  );
  const cls = cn(
    "flex min-h-14 items-center gap-3 px-4 py-2.5 transition-colors duration-150 md:px-5",
    (href || onClick) && "hover:bg-surface-muted",
    className,
  );
  if (href)
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    );
  if (onClick)
    return (
      <button type="button" onClick={onClick} className={cn(cls, "w-full text-left")}>
        {content}
      </button>
    );
  return <div className={cls}>{content}</div>;
}

export function KeyValue({ items, className }: { items: [string, React.ReactNode][]; className?: string }) {
  return (
    <dl className={cn("grid gap-x-6 gap-y-3 sm:grid-cols-2", className)}>
      {items.map(([k, v]) => (
        <div key={k} className="flex min-w-0 flex-col">
          <dt className="t-small text-muted">{k}</dt>
          <dd className="min-w-0 break-words">{v || <span className="text-muted">Not set</span>}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Progress({ value, className, label }: { value: number; className?: string; label: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-muted", className)}
    >
      <div className="h-full rounded-full bg-accent transition-[width] duration-200" style={{ width: `${value}%` }} />
    </div>
  );
}

export function Notice({
  tone = "info",
  icon: Icon,
  title,
  children,
  action,
  className,
}: {
  tone?: "info" | "warning" | "danger" | "success" | "neutral";
  icon?: Icon;
  title?: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role={tone === "danger" ? "alert" : undefined}
      className={cn(
        "flex flex-col gap-3 rounded-[12px] border p-4 sm:flex-row sm:items-start",
        tone === "info" && "border-info/20 bg-info-soft",
        tone === "warning" && "border-warning/25 bg-warning-soft",
        tone === "danger" && "border-danger/25 bg-danger-soft",
        tone === "success" && "border-success/25 bg-success-soft",
        tone === "neutral" && "border-border bg-surface-muted",
        className,
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            "mt-0.5 size-5 shrink-0",
            tone === "info" && "text-info",
            tone === "warning" && "text-warning",
            tone === "danger" && "text-danger",
            tone === "success" && "text-success",
            tone === "neutral" && "text-muted",
          )}
          aria-hidden
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="text-[14px] leading-6">{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function LinkButton({
  href,
  children,
  variant = "secondary",
  size = "md",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
