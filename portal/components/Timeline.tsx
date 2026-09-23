import { type Icon, Check, Clock, FilePlus as FilePlus2, Question as HelpCircle, Lock, ChatText as MessageSquare, ArrowCounterClockwise as RotateCcw, Scales as Scale, X } from "@phosphor-icons/react";
import type { TimelineEvent } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";

const KIND: Record<TimelineEvent["kind"], { label: string; icon: Icon; cls: string }> = {
  created: { label: "Draft started", icon: FilePlus2, cls: "bg-surface-muted text-muted" },
  submitted: { label: "Submitted", icon: Clock, cls: "bg-info-soft text-info" },
  queried: { label: "Queried", icon: HelpCircle, cls: "bg-warning-soft text-warning" },
  replied: { label: "Replied", icon: MessageSquare, cls: "bg-info-soft text-info" },
  verified: { label: "Verified", icon: Check, cls: "bg-success-soft text-success" },
  rejected: { label: "Rejected", icon: X, cls: "bg-danger-soft text-danger" },
  appealed: { label: "Appealed", icon: Scale, cls: "bg-accent-soft text-accent" },
  upheld: { label: "Appeal: decision upheld", icon: Lock, cls: "bg-surface-muted text-text" },
  returned: { label: "Appeal: returned to queue", icon: RotateCcw, cls: "bg-info-soft text-info" },
};

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative flex flex-col gap-4">
      {events.map((e, i) => {
        const k = KIND[e.kind];
        const Icon = k.icon;
        const last = i === events.length - 1;
        return (
          <li key={`${e.at}-${i}`} className="relative flex gap-3">
            {!last && <span className="absolute top-8 bottom-[-16px] left-[13px] w-px bg-border" aria-hidden />}
            <span className={cn("relative grid size-7 shrink-0 place-items-center rounded-full", k.cls)}>
              <Icon className="size-3.5" aria-hidden />
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="text-[14px] font-medium leading-6">{k.label}</span>
              <span className="t-small text-muted">
                {e.by} · {formatDateTime(e.at)}
              </span>
              {e.text && (
                <p className="mt-1.5 rounded-[8px] bg-surface-muted px-3 py-2 text-[14px] leading-6">“{e.text}”</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
