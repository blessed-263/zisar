import Link from "next/link";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  change,
  tone,
  href,
}: {
  label: string;
  value: number | string;
  change?: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
  href?: string;
}) {
  const body = (
    <div className="flex h-full flex-col gap-2 rounded-[14px] border border-border bg-surface p-4 shadow-[var(--shadow-card)] transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/25">
      <span className="t-label flex items-center gap-2">
        {tone && tone !== "default" && (
          <span
            className={cn(
              "size-2 rounded-full",
              tone === "success" && "bg-success",
              tone === "warning" && "bg-warning",
              tone === "danger" && "bg-danger",
              tone === "info" && "bg-info",
            )}
            aria-hidden
          />
        )}
        {label}
      </span>
      <span className="font-display tabular text-[34px] leading-10 font-medium tracking-[-0.03em]">{value}</span>
      {change && <span className="t-small text-muted">{change}</span>}
    </div>
  );
  return href ? (
    <Link href={href} className="block rounded-[12px]">
      {body}
    </Link>
  ) : (
    body
  );
}
