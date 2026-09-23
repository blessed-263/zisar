"use client";

import * as React from "react";
import Link from "next/link";
import { Image as ImageIcon } from "@phosphor-icons/react";
import { cn, formatDate } from "@/lib/utils";

export function PosterCard({
  title,
  date,
  image,
  alt,
  chip,
  href,
  unread,
  footer,
  className,
}: {
  title: string;
  date: string;
  image?: string;
  alt?: string;
  chip?: string;
  href?: string;
  unread?: boolean;
  footer?: React.ReactNode;
  className?: string;
}) {
  const inner = (
    <>
      <div className="photo-frame relative aspect-[16/10] overflow-hidden bg-accent-soft">
        {image ? (
          <img
            src={image}
            alt={alt ?? ""}
            className="size-full object-cover transition-transform duration-500 ease-[var(--ease)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid size-full place-items-center text-accent">
            <ImageIcon className="size-8" aria-hidden />
          </div>
        )}
        {unread && (
          <span className="absolute top-3 left-3 inline-flex h-6 items-center gap-1.5 rounded-full bg-surface/95 px-2.5 text-[12px] font-medium text-text shadow-sm backdrop-blur">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            New
          </span>
        )}
        {chip && (
          <span className="absolute right-3 bottom-3 rounded-full bg-surface/95 px-2.5 py-0.5 text-[12px] font-medium text-text shadow-sm backdrop-blur">
            {chip}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <h3 className="font-display text-[17px] leading-6 font-medium tracking-[-0.02em]">{title}</h3>
        <div className="t-small flex flex-wrap items-center gap-2 text-muted">
          <span>{formatDate(date)}</span>
        </div>
        {footer}
      </div>
    </>
  );
  const cls = cn(
    "group block overflow-hidden rounded-[14px] border border-border bg-surface shadow-[var(--shadow-card)] transition-[border-color,box-shadow,transform] duration-250 ease-[var(--ease)] hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-[var(--shadow-float)]",
    className,
  );
  return href ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
