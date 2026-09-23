"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, CaretDown as ChevronDown, Lock } from "@phosphor-icons/react";
import { useDemo } from "@/lib/store";
import { fullName, officesForVoter, uniOf } from "@/lib/selectors";
import type { Election, Student } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/sheet";
import { Avatar } from "@/components/blocks";

export function Ballot({ election, voter, onCancel }: { election: Election; voter: Student; onCancel: () => void }) {
  const data = useDemo((s) => s.data);
  const castVote = useDemo((s) => s.castVote);
  const offices = officesForVoter(data, election, voter);
  const [step, setStep] = React.useState(0);
  const [choices, setChoices] = React.useState<Record<string, string>>({});
  const [openStatement, setOpenStatement] = React.useState<string | null>(null);
  const [confirm, setConfirm] = React.useState(false);
  const [receipt, setReceipt] = React.useState<{ code: string; at: string } | null>(null);
  const top = React.useRef<HTMLDivElement>(null);
  const reviewing = step === offices.length;

  function go(n: number) {
    setStep(n);
    setOpenStatement(null);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (receipt) return <Receipt code={receipt.code} at={receipt.at} title={election.title} />;

  const office = offices[step];
  const candidates = office ? election.nominations.filter((n) => n.officeId === office.id && n.status === "accepted") : [];
  const label = (id: string) => (id === "abstain" ? "Abstain" : fullName(data.students.find((s) => s.id === id)));

  return (
    <div ref={top} className="scroll-mt-20">
    <Card>
      <CardHeader
        label={election.title}
        title={reviewing ? "Check your choices" : office.name}
        description={reviewing ? "Once cast, your ballot cannot be changed." : office.city ? `Only members in ${office.city} vote for this office.` : "Choose one candidate, or abstain."}
        action={
          <div className="flex items-center gap-1.5" aria-label={`Step ${step + 1} of ${offices.length + 1}`}>
            {[...offices, null].map((_, i) => (
              <span key={i} className={cn("size-2 rounded-full transition-colors duration-200", i < step ? "bg-accent" : i === step ? "bg-gold" : "bg-surface-muted")} aria-hidden />
            ))}
          </div>
        }
      />
      <CardBody>
        {!reviewing ? (
          <div role="radiogroup" aria-label={office.name} className="flex flex-col gap-2.5">
            {candidates.map((n) => {
              const c = data.students.find((s) => s.id === n.studentId)!;
              const selected = choices[office.id] === c.id;
              return (
                <div key={n.id} className={cn("rounded-[12px] border transition-colors duration-150", selected ? "border-accent bg-accent-soft" : "border-border hover:border-muted/50")}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setChoices({ ...choices, [office.id]: c.id })}
                    className="flex w-full items-center gap-4 p-4 text-left"
                  >
                    <Avatar name={fullName(c)} photo={c.photo} size={56} />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="text-[17px] font-semibold">{fullName(c)}</span>
                      <span className="t-small text-muted">{uniOf(data, c)?.name}</span>
                    </span>
                    <span className={cn("grid size-6 shrink-0 place-items-center rounded-full border-2", selected ? "border-accent bg-accent" : "border-border")} aria-hidden>
                      {selected && <span className="size-2 rounded-full bg-accent-contrast" />}
                    </span>
                  </button>
                  <div className="border-t border-border/70 px-4 py-2">
                    <button type="button" className="t-small flex items-center gap-1 font-medium text-accent" aria-expanded={openStatement === n.id} onClick={() => setOpenStatement(openStatement === n.id ? null : n.id)}>
                      Read statement
                      <ChevronDown className={cn("size-3.5 transition-transform", openStatement === n.id && "rotate-180")} aria-hidden />
                    </button>
                    {openStatement === n.id && <p className="anim-fade mt-2 mb-1 text-[14px] leading-6">“{n.statement}”</p>}
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              role="radio"
              aria-checked={choices[office.id] === "abstain"}
              onClick={() => setChoices({ ...choices, [office.id]: "abstain" })}
              className={cn("flex items-center justify-between rounded-[12px] border border-dashed p-4 text-left", choices[office.id] === "abstain" ? "border-accent bg-accent-soft" : "border-border hover:border-muted/50")}
            >
              <span className="flex flex-col">
                <span className="font-medium">Abstain</span>
                <span className="t-small text-muted">Counted in turnout, not for any candidate</span>
              </span>
              <span className={cn("grid size-6 place-items-center rounded-full border-2", choices[office.id] === "abstain" ? "border-accent bg-accent" : "border-border")} aria-hidden>
                {choices[office.id] === "abstain" && <span className="size-2 rounded-full bg-accent-contrast" />}
              </span>
            </button>
          </div>
        ) : (
          <dl className="flex flex-col divide-y divide-border rounded-[12px] border border-border">
            {offices.map((o, i) => (
              <div key={o.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <dt className="text-muted">{o.name}</dt>
                <dd className="flex items-center gap-3 font-semibold">
                  {label(choices[o.id])}
                  <button type="button" className="t-small font-medium text-accent hover:underline" onClick={() => go(i)}>
                    Change
                  </button>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </CardBody>
      <CardFooter className="justify-between">
        <Button variant="ghost" onClick={() => (step === 0 ? onCancel() : go(step - 1))}>
          <ArrowLeft className="size-4" aria-hidden />
          {step === 0 ? "Cancel" : "Back"}
        </Button>
        {reviewing ? (
          <Button variant="primary" onClick={() => setConfirm(true)}>
            <Lock className="size-4" aria-hidden />
            Cast my vote
          </Button>
        ) : (
          <Button variant="primary" disabled={!choices[office.id]} onClick={() => go(step + 1)}>
            {step === offices.length - 1 ? "Review" : "Next office"}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        )}
      </CardFooter>
      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Cast your vote?"
        description="Your ballot is sealed when you confirm. Nobody, including the election officer, can see your choices."
        confirmLabel="Cast my vote"
        onConfirm={() => {
          const code = castVote(election.id, voter.id, choices);
          setReceipt({ code, at: new Date().toISOString() });
        }}
      />
    </Card>
    </div>
  );
}

export function Receipt({ code, at, title }: { code: string; at: string; title: string }) {
  return (
    <Card className="anim-scale">
      <CardBody className="flex flex-col items-center gap-4 py-10 text-center">
        <svg viewBox="0 0 52 52" className="size-16 text-success" aria-hidden>
          <circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25" />
          <path className="anim-check" d="M15 27 l7 7 l15 -16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="flex flex-col gap-1">
          <h2 className="t-title">Your vote is cast</h2>
          <p className="text-muted">{title}</p>
        </div>
        <dl className="flex flex-col gap-2 rounded-[12px] border border-border bg-surface-muted/60 px-6 py-4">
          <div>
            <dt className="t-label">Time</dt>
            <dd className="tabular font-medium">{formatDateTime(at)}</dd>
          </div>
          <div>
            <dt className="t-label">Receipt</dt>
            <dd className="font-mono text-[18px] font-semibold tracking-wider">{code}</dd>
          </div>
        </dl>
        <p className="t-small max-w-xs text-muted">Your choices are not shown here, by design. Keep the receipt code to confirm your ballot was counted.</p>
      </CardBody>
    </Card>
  );
}
