"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, Lock, Plus, ShieldCheck, Trash as Trash2, X } from "@phosphor-icons/react";
import { useDemo, withUndo, toast } from "@/lib/store";
import { ELECTION_STAGES, fullName, nextStage, turnout, uniOf } from "@/lib/selectors";
import type { City, Election, Nomination, Office } from "@/lib/types";
import { CITIES } from "@/lib/constants";
import { formatDate, uid } from "@/lib/utils";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { ConfirmDialog, Sheet } from "@/components/ui/sheet";
import { Tabs } from "@/components/ui/tabs";
import { Avatar, Notice, PageHeader, Progress } from "@/components/blocks";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { Guard } from "@/components/Guard";
import { StageTrack } from "@/components/elections/StageTrack";
import { Results } from "@/components/elections/Results";

export default function ElectionConsolePage() {
  return (
    <Guard area="election-console">
      <Console />
    </Guard>
  );
}

function Console() {
  const data = useDemo((s) => s.data);
  const elections = data.elections.filter((e) => e.status !== "archived");
  const [id, setId] = React.useState(elections[0]?.id ?? "");
  const [drafting, setDrafting] = React.useState(false);
  const e = data.elections.find((x) => x.id === id) ?? elections[0];

  return (
    <>
      <PageHeader
        label="Election officer"
        title="Election console"
        description="You move the election through its stages. Totals stay hidden until voting closes, and no screen shows who voted for whom."
        actions={
          <Button variant="secondary" onClick={() => setDrafting(true)}>
            <Plus className="size-4" aria-hidden />
            Draft an election
          </Button>
        }
      />
      {elections.length > 1 && (
        <Tabs
          label="Elections"
          value={e?.id ?? ""}
          onChange={setId}
          items={elections.map((x) => ({ value: x.id, label: x.title }))}
          className="mb-6"
        />
      )}
      {e ? <ElectionPanel key={e.id} election={e} /> : <EmptyState icon={ShieldCheck} title="No election in progress. Draft one to begin." />}
      <DraftSheet open={drafting} onOpenChange={setDrafting} onCreated={(newId) => setId(newId)} />
    </>
  );
}

function ElectionPanel({ election: e }: { election: Election }) {
  const data = useDemo((s) => s.data);
  const advance = useDemo((s) => s.advanceElection);
  const apply = useDemo((s) => s.applyResultsToCommittee);
  const [confirmStage, setConfirmStage] = React.useState(false);
  const [confirmApply, setConfirmApply] = React.useState(false);
  const next = nextStage(e.status);
  const nextMeta = ELECTION_STAGES.find((s) => s.status === next);
  const t = turnout(data, e);
  const pending = e.nominations.filter((n) => n.status === "pending");
  const totalsVisible = ["closed", "published", "archived"].includes(e.status);
  const blocked = e.status === "vetting" && pending.length > 0 ? `${pending.length} nomination${pending.length === 1 ? "" : "s"} still waiting for a decision.` : undefined;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardBody className="flex flex-col gap-5">
          <StageTrack status={e.status} />
          <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
            <div className="flex flex-1 flex-col">
              <span className="t-small text-muted">
                Officer {e.officerName} · Scrutineer {e.scrutineerName} · Quorum {e.quorumPct}%
              </span>
              <span className="t-small text-muted">
                Nominations close {formatDate(e.nominationsClose)} · Voting {formatDate(e.votingOpens)} to {formatDate(e.votingCloses)}
              </span>
            </div>
            {next && (
              <Button variant="primary" disabled={!!blocked} onClick={() => setConfirmStage(true)}>
                Move to {nextMeta?.label.toLowerCase()}
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            )}
          </div>
          {blocked && <p className="t-small text-warning">{blocked}</p>}
        </CardBody>
      </Card>

      {(e.status === "voting" || totalsVisible) && (
        <Card>
          <CardHeader title="Turnout" description="Counted from the voter roll. The roll records only that someone voted." />
          <CardBody className="flex flex-col gap-3">
            <div className="flex items-baseline gap-3">
              <span className="tabular text-[32px] font-semibold">{t.pct}%</span>
              <span className="text-muted">
                {t.voted} of {t.eligible} eligible members
              </span>
            </div>
            <Progress value={t.pct} label="Turnout" />
            <p className="t-small text-muted">{t.pct >= e.quorumPct ? "Quorum reached." : `Quorum needs ${e.quorumPct}%.`}</p>
          </CardBody>
        </Card>
      )}

      {e.status === "voting" && (
        <Notice tone="neutral" icon={Lock} title="Totals are sealed while voting is open">
          Candidate totals become visible to you and the scrutineer when you close voting.
        </Notice>
      )}

      {totalsVisible && (
        <Card>
          <CardHeader
            title={e.status === "closed" ? "Totals, not yet public" : "Published results"}
            description={e.status === "closed" ? "Check them with the scrutineer, then publish." : e.publishedAt ? `Published ${formatDate(e.publishedAt)}` : undefined}
          />
          <CardBody>
            <Results election={e} />
          </CardBody>
          {e.status === "published" && (
            <CardFooter className="justify-between">
              <span className="t-small text-muted">{e.committeeUpdated ? "Winners are on the committee cards." : "Ties are left for the executive to resolve by the constitution."}</span>
              <Button variant={e.committeeUpdated ? "secondary" : "primary"} disabled={e.committeeUpdated} onClick={() => setConfirmApply(true)}>
                <ShieldCheck className="size-4" aria-hidden />
                {e.committeeUpdated ? "Committee updated" : "Put winners on committee cards"}
              </Button>
            </CardFooter>
          )}
        </Card>
      )}

      {e.status !== "draft" && <Vetting election={e} />}

      {e.status === "draft" && (
        <Card>
          <CardHeader title="Offices on this ballot" />
          <CardBody className="flex flex-wrap gap-2">
            {e.offices.map((o) => (
              <span key={o.id} className="rounded-full border border-border px-3 py-1 text-[14px]">
                {o.name}
                {o.city ? <span className="text-muted"> · {o.city}</span> : null}
              </span>
            ))}
          </CardBody>
        </Card>
      )}

      <p className="t-small text-muted">
        Students see this election on the{" "}
        <Link href="/elections?tab=portal" className="font-medium text-accent hover:underline">
          public elections page
        </Link>
        .
      </p>

      <ConfirmDialog
        open={confirmStage}
        onOpenChange={setConfirmStage}
        title={`Move to ${nextMeta?.label.toLowerCase()}?`}
        description={`${nextMeta?.description}${next === "nominations" || next === "voting" || next === "published" ? " Every student gets a notice." : ""} Stages only move forward.`}
        confirmLabel={`Move to ${nextMeta?.label.toLowerCase()}`}
        onConfirm={() => {
          if (!next) return;
          advance(e.id, next);
          toast(`${e.title} is now at ${nextMeta?.label.toLowerCase()}.`, { tone: "success" });
        }}
      />
      <ConfirmDialog
        open={confirmApply}
        onOpenChange={setConfirmApply}
        title="Put winners on the committee cards?"
        description="Each office with a clear winner replaces the current card. Ties are skipped."
        confirmLabel="Update committee"
        onConfirm={() => withUndo("Committee cards updated with the winners.", () => apply(e.id))}
      />
    </div>
  );
}

function Vetting({ election: e }: { election: Election }) {
  const data = useDemo((s) => s.data);
  const vet = useDemo((s) => s.vetNomination);
  const [declining, setDeclining] = React.useState<Nomination | null>(null);
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState("");
  const canVet = e.status === "vetting" || e.status === "nominations";

  return (
    <Card>
      <CardHeader
        title="Nominations"
        description={canVet ? "Accept a nomination when both supporters have confirmed and the candidate is eligible." : "Vetting is finished."}
      />
      <div className="mt-3 flex flex-col divide-y divide-border border-t border-border">
        {e.offices.map((o) => {
          const noms = e.nominations.filter((n) => n.officeId === o.id);
          return (
            <div key={o.id} className="flex flex-col gap-2 px-5 py-4">
              <span className="t-label">{o.name}</span>
              {noms.length === 0 && <span className="t-small text-muted">No nominations.</span>}
              {noms.map((n) => {
                const c = data.students.find((s) => s.id === n.studentId);
                const supported = n.proposerConfirmed && n.seconderConfirmed;
                return (
                  <div key={n.id} className="flex flex-col gap-3 rounded-[10px] border border-border p-3 md:flex-row md:items-center">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <Avatar name={fullName(c)} photo={c?.photo} size={40} />
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span className="flex flex-wrap items-center gap-2 font-medium">
                          {fullName(c)}
                          <StatusPill status={n.status} size="sm" />
                        </span>
                        <span className="t-small text-muted">
                          {uniOf(data, c)?.name} · Proposer {n.proposerConfirmed ? "confirmed" : "waiting"} · Seconder {n.seconderConfirmed ? "confirmed" : "waiting"}
                        </span>
                        <p className="t-small line-clamp-2">“{n.statement}”</p>
                        {n.reason && <p className="t-small text-danger">Declined: {n.reason}</p>}
                      </div>
                    </div>
                    {canVet && n.status === "pending" && (
                      <div className="flex shrink-0 gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setDeclining(n);
                            setReason("");
                            setError("");
                          }}
                        >
                          <X className="size-4" aria-hidden />
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={!supported}
                          title={supported ? undefined : "Both supporters must confirm first"}
                          onClick={() => withUndo(`${fullName(c)} accepted as a candidate.`, () => vet(e.id, n.id, true))}
                        >
                          <Check className="size-4" aria-hidden />
                          Accept
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <Sheet
        open={!!declining}
        onOpenChange={(o) => !o && setDeclining(null)}
        title="Decline nomination"
        description="The candidate sees this reason. Point to the rule in the constitution."
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeclining(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (reason.trim().length < 10) return setError("Give the candidate a clear reason.");
                const n = declining!;
                withUndo("Nomination declined. The candidate was told why.", () => vet(e.id, n.id, false, reason.trim()));
                setDeclining(null);
              }}
            >
              Decline nomination
            </Button>
          </>
        }
      >
        <Field label="Reason" error={error} required>
          <Textarea value={reason} onChange={(ev) => setReason(ev.target.value)} placeholder="For example: the seconder is not an enrolled member (constitution, section 4.2)." />
        </Field>
      </Sheet>
    </Card>
  );
}

const TEMPLATE_OFFICES: Office[] = [
  { id: "", name: "President" },
  { id: "", name: "Vice President" },
  { id: "", name: "Secretary General" },
  { id: "", name: "Treasurer" },
];

function DraftSheet({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (o: boolean) => void; onCreated: (id: string) => void }) {
  const createElection = useDemo((s) => s.createElection);
  const [title, setTitle] = React.useState("General election 2027/28");
  const [offices, setOffices] = React.useState<Office[]>(() => TEMPLATE_OFFICES.map((o) => ({ ...o, id: uid("off") })));
  const [quorum, setQuorum] = React.useState(40);
  const [dates, setDates] = React.useState({ nominationsClose: "", votingOpens: "", votingCloses: "" });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function submit() {
    const err: Record<string, string> = {};
    if (!title.trim()) err.title = "Name the election.";
    if (!offices.length || offices.some((o) => !o.name.trim())) err.offices = "Every office needs a name.";
    if (!dates.nominationsClose || !dates.votingOpens || !dates.votingCloses) err.dates = "Set all three dates.";
    else if (!(dates.nominationsClose < dates.votingOpens && dates.votingOpens < dates.votingCloses)) err.dates = "Nominations close before voting opens, and voting opens before it closes.";
    if (quorum < 1 || quorum > 100) err.quorum = "Quorum is a percentage from 1 to 100.";
    setErrors(err);
    if (Object.keys(err).length) return;
    createElection({ title: title.trim(), offices, quorumPct: quorum, ...dates });
    const created = useDemo.getState().data.elections[0];
    if (created) onCreated(created.id);
    toast("Election drafted. Students cannot see it until you open nominations.", { tone: "success" });
    onOpenChange(false);
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Draft an election"
      description="Set the offices, dates, and quorum from the constitution."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit}>
            Save draft
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Title" error={errors.title} required>
          <Input value={title} onChange={(ev) => setTitle(ev.target.value)} />
        </Field>
        <div className="flex flex-col gap-2">
          <span className="text-[14px] font-medium">Offices</span>
          {offices.map((o, i) => (
            <div key={o.id} className="flex gap-2">
              <Input
                aria-label={`Office ${i + 1}`}
                value={o.name}
                onChange={(ev) => setOffices(offices.map((x) => (x.id === o.id ? { ...x, name: ev.target.value } : x)))}
              />
              <Select
                aria-label={`Who elects office ${i + 1}`}
                className="w-44"
                value={o.city ?? ""}
                onChange={(ev) => setOffices(offices.map((x) => (x.id === o.id ? { ...x, city: (ev.target.value || undefined) as City | undefined } : x)))}
              >
                <option value="">All members</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c} only
                  </option>
                ))}
              </Select>
              <Button variant="ghost" size="icon" aria-label={`Remove ${o.name || "office"}`} onClick={() => setOffices(offices.filter((x) => x.id !== o.id))}>
                <Trash2 className="size-4" aria-hidden />
              </Button>
            </div>
          ))}
          {errors.offices && <p className="t-small text-danger">{errors.offices}</p>}
          <Button variant="ghost" size="sm" className="self-start" onClick={() => setOffices([...offices, { id: uid("off"), name: "" }])}>
            <Plus className="size-4" aria-hidden />
            Add office
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Nominations close" required>
            <Input type="date" value={dates.nominationsClose} onChange={(ev) => setDates({ ...dates, nominationsClose: ev.target.value })} />
          </Field>
          <Field label="Voting opens" required>
            <Input type="date" value={dates.votingOpens} onChange={(ev) => setDates({ ...dates, votingOpens: ev.target.value })} />
          </Field>
          <Field label="Voting closes" required>
            <Input type="date" value={dates.votingCloses} onChange={(ev) => setDates({ ...dates, votingCloses: ev.target.value })} />
          </Field>
        </div>
        {errors.dates && <p className="t-small -mt-2 text-danger">{errors.dates}</p>}
        <Field label="Quorum, percent of eligible members" error={errors.quorum} required>
          <Input type="number" min={1} max={100} value={quorum} onChange={(ev) => setQuorum(Number(ev.target.value))} className="w-32" />
        </Field>
      </div>
    </Sheet>
  );
}
