import { Check } from "@phosphor-icons/react";
import type { Election } from "@/lib/types";
import { ELECTION_STAGES } from "@/lib/selectors";
import { cn } from "@/lib/utils";

export function StageTrack({ status, compact }: { status: Election["status"]; compact?: boolean }) {
  const stages = ELECTION_STAGES.filter((s) => s.status !== "archived" && (!compact || s.status !== "draft"));
  const idx = ELECTION_STAGES.findIndex((s) => s.status === status);
  return (
    <ol className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none]" aria-label="Election stages">
      {stages.map((s) => {
        const i = ELECTION_STAGES.findIndex((x) => x.status === s.status);
        const done = i < idx;
        const cur = i === idx;
        return (
          <li key={s.status} className="flex min-w-24 flex-1 flex-col gap-1.5" aria-current={cur ? "step" : undefined}>
            <span className={cn("h-1 rounded-full", done ? "bg-accent" : cur ? "bg-gold" : "bg-surface-muted")} aria-hidden />
            <span className={cn("flex items-center gap-1 text-[12px] leading-4", cur ? "font-semibold text-text" : "text-muted")}>
              {done && <Check className="size-3 text-accent" aria-hidden />}
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
