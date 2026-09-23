"use client";

import { GraduationCap } from "@phosphor-icons/react";
import { useDemo, useCurrentStudent } from "@/lib/store";
import { OUTCOME_LABEL } from "@/lib/constants";
import { submissionFor, windowAppliesTo, windowIsOpen, windowStateFor } from "@/lib/selectors";
import { formatDate, relativeDays } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { PageHeader, Row } from "@/components/blocks";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { Guard } from "@/components/Guard";

export default function SemestersPage() {
  return (
    <Guard area="own-file">
      <Semesters />
    </Guard>
  );
}

function Semesters() {
  const data = useDemo((s) => s.data);
  const s = useCurrentStudent();
  const windows = data.windows.filter((w) => windowAppliesTo(w, s)).sort((a, b) => b.deadline.localeCompare(a.deadline));
  const open = windows.filter((w) => windowIsOpen(w));
  const past = windows.filter((w) => !windowIsOpen(w));

  const row = (w: (typeof windows)[number]) => {
    const st = windowStateFor(data, w, s);
    const sub = submissionFor(data, w.id, s.id);
    const isOpen = windowIsOpen(w);
    return (
      <Row
        key={w.id}
        href={`/semesters/${w.id}`}
        icon={GraduationCap}
        title={w.name}
        meta={
          isOpen
            ? `Due ${formatDate(w.deadline)} · ${relativeDays(w.deadline)}`
            : sub
              ? `${OUTCOME_LABEL[sub.outcome]}${sub.decidedAt ? ` · decided ${formatDate(sub.decidedAt)}` : ""}`
              : `Closed ${formatDate(w.deadline)}`
        }
        trailing={
          <span className="flex items-center gap-2">
            {sub?.appeal && <StatusPill status={sub.appeal.status === "pending" ? "pending" : sub.appeal.status} label={sub.appeal.status === "pending" ? "Appeal pending" : undefined} size="sm" className="hidden sm:inline-flex" />}
            <StatusPill status={st} size="sm" />
          </span>
        }
      />
    );
  };

  return (
    <>
      <PageHeader
        title="Semesters"
        description="Each semester, upload your official result sheet and declare the outcome. A verifier checks it against the sheet."
      />
      <div className="flex flex-col gap-8">
        <section aria-labelledby="open">
          <h2 id="open" className="t-label mb-3">
            Open now
          </h2>
          {open.length ? (
            <Card className="divide-y divide-border overflow-hidden">{open.map(row)}</Card>
          ) : (
            <EmptyState icon={GraduationCap} title="No window is open. You will get a notice when the next one opens." />
          )}
        </section>
        <section aria-labelledby="past">
          <h2 id="past" className="t-label mb-3">
            Earlier semesters
          </h2>
          {past.length ? (
            <Card className="divide-y divide-border overflow-hidden">{past.map(row)}</Card>
          ) : (
            <EmptyState icon={GraduationCap} title="Your earlier semesters will appear here." />
          )}
        </section>
      </div>
    </>
  );
}
