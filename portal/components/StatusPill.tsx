import { type Icon, Warning as AlertTriangle, Check, Circle as CircleDot, Clock, Hourglass, Lock, PencilSimple as Pencil, Question as HelpCircle, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type PillStatus =
  | "draft"
  | "submitted"
  | "received"
  | "verified"
  | "queried"
  | "rejected"
  | "overdue"
  | "expiring"
  | "expired"
  | "not-started"
  | "open"
  | "closed"
  | "pending"
  | "accepted"
  | "declined"
  | "enrolled"
  | "sent"
  | "confirmed"
  | "answered"
  | "upheld"
  | "returned"
  | "locked";

const MAP: Record<PillStatus, { label: string; icon: Icon; cls: string }> = {
  draft: { label: "Draft", icon: Pencil, cls: "bg-surface-muted text-muted" },
  "not-started": { label: "Not started", icon: CircleDot, cls: "bg-surface-muted text-muted" },
  submitted: { label: "Submitted", icon: Clock, cls: "bg-info-soft text-info" },
  received: { label: "In review", icon: Clock, cls: "bg-info-soft text-info" },
  pending: { label: "Pending", icon: Clock, cls: "bg-info-soft text-info" },
  sent: { label: "Sent for confirmation", icon: Clock, cls: "bg-info-soft text-info" },
  verified: { label: "Verified", icon: Check, cls: "bg-success-soft text-success" },
  accepted: { label: "Accepted", icon: Check, cls: "bg-success-soft text-success" },
  confirmed: { label: "Confirmed", icon: Check, cls: "bg-success-soft text-success" },
  enrolled: { label: "Enrolled", icon: Check, cls: "bg-success-soft text-success" },
  answered: { label: "Answered", icon: Check, cls: "bg-success-soft text-success" },
  upheld: { label: "Decision upheld", icon: Lock, cls: "bg-surface-muted text-text" },
  returned: { label: "Sent back for review", icon: Clock, cls: "bg-info-soft text-info" },
  queried: { label: "Queried", icon: HelpCircle, cls: "bg-warning-soft text-warning" },
  expiring: { label: "Expiring", icon: Hourglass, cls: "bg-warning-soft text-warning" },
  rejected: { label: "Rejected", icon: X, cls: "bg-danger-soft text-danger" },
  declined: { label: "Declined", icon: X, cls: "bg-danger-soft text-danger" },
  expired: { label: "Expired", icon: Hourglass, cls: "bg-danger-soft text-danger" },
  overdue: { label: "Overdue", icon: AlertTriangle, cls: "border border-muted/50 bg-transparent text-muted" },
  open: { label: "Open", icon: CircleDot, cls: "bg-accent-soft text-accent" },
  closed: { label: "Closed", icon: Lock, cls: "bg-surface-muted text-muted" },
  locked: { label: "Locked", icon: Lock, cls: "bg-surface-muted text-muted" },
};

export function StatusPill({
  status,
  label,
  className,
  size = "md",
}: {
  status: PillStatus;
  label?: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const m = MAP[status];
  const Icon = m.icon;
  return (
    <span
      key={status}
      className={cn(
        "anim-fade inline-flex shrink-0 items-center gap-1 rounded-full font-medium whitespace-nowrap",
        size === "md" ? "h-6 px-2.5 text-[12.5px]" : "h-5 px-2 text-[11.5px]",
        m.cls,
        className,
      )}
    >
      <Icon className={size === "md" ? "size-3.5" : "size-3"} aria-hidden />
      {label ?? m.label}
    </span>
  );
}
