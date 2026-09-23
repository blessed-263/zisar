"use client";

import { Trophy } from "@phosphor-icons/react";
import { useDemo } from "@/lib/store";
import { fullName, turnout, winners } from "@/lib/selectors";
import type { Election } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Totals only. There is no view anywhere that links a voter to a choice. */
export function Results({ election }: { election: Election }) {
  const data = useDemo((s) => s.data);
  const t = turnout(data, election);
  const quorate = t.pct >= election.quorumPct;
  const name = (id: string) => (id === "abstain" ? "Abstained" : fullName(data.students.find((s) => s.id === id)));
  return (
    <div className="flex flex-col gap-5">
      <p className="text-[14px]">
        Turnout <span className="tabular font-semibold">{t.pct}%</span> ({t.voted} of {t.eligible} eligible members).{" "}
        <span className={quorate ? "text-success" : "text-warning"}>{quorate ? "Quorum reached." : `Quorum of ${election.quorumPct}% not reached.`}</span>
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {winners(election).map(({ office, tally, top, tie, total }) => (
          <div key={office.id} className="rounded-[12px] border border-border p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="font-semibold">{office.name}</span>
              {office.city && <span className="t-small text-muted">{office.city} members only</span>}
            </div>
            <ul className="flex flex-col gap-2.5">
              {Object.entries(tally)
                .sort(([a, x], [b, y]) => (a === "abstain" ? 1 : b === "abstain" ? -1 : y - x))
                .map(([id, n]) => {
                  const won = top.includes(id) && !tie;
                  return (
                    <li key={id} className="flex flex-col gap-1">
                      <span className="flex items-center justify-between gap-2 text-[14px]">
                        <span className={cn("flex items-center gap-1.5", won && "font-semibold", id === "abstain" && "text-muted")}>
                          {won && <Trophy className="size-3.5 text-gold" aria-label="Elected" />}
                          {name(id)}
                        </span>
                        <span className="tabular text-muted">
                          {n} {n === 1 ? "vote" : "votes"}
                        </span>
                      </span>
                      <span className="h-1.5 overflow-hidden rounded-full bg-surface-muted" aria-hidden>
                        <span className={cn("block h-full rounded-full", id === "abstain" ? "bg-muted/40" : won ? "bg-accent" : "bg-accent/40")} style={{ width: `${total ? (n / total) * 100 : 0}%` }} />
                      </span>
                    </li>
                  );
                })}
            </ul>
            {tie && <p className="t-small mt-3 text-warning">Tie. Settled as the constitution says.</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
