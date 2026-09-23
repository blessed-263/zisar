"use client";

import * as React from "react";
import Link from "next/link";
import { Hourglass, UserPlus, CheckSquare as Vote } from "@phosphor-icons/react";
import { useDemo, useCurrentStudent, toast } from "@/lib/store";
import { canVote, eligibleVoters, fullName, officesForVoter, turnout, uniOf } from "@/lib/selectors";
import type { Election } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Select, Textarea } from "@/components/ui/field";
import { Avatar, Notice, Progress } from "@/components/blocks";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { Ballot, Receipt } from "./Ballot";
import { Results } from "./Results";
import { StageTrack } from "./StageTrack";

export function Portal() {
  const data = useDemo((s) => s.data);
  const role = useDemo((s) => s.role);
  const me = useCurrentStudent();
  const e = data.elections.find((x) => x.status !== "archived" && x.status !== "draft");
  const [voting, setVoting] = React.useState(false);

  if (!e) return <EmptyState icon={Vote} title="No election is running. The officer announces the next one in Notices." />;
  const t = turnout(data, e);
  const isStudent = role === "student";
  const eligible = canVote(data, me);
  const receipt = data.receipts.find((r) => r.electionId === e.id && r.studentId === me.id);
  const showCandidates = ["statements", "voting", "closed", "published"].includes(e.status);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardBody className="flex flex-col gap-4">
          <StageTrack status={e.status} compact />
          {(e.status === "voting" || e.status === "closed" || e.status === "published") && (
            <div className="flex flex-col gap-1.5">
              <span className="flex justify-between text-[14px]">
                <span>
                  Turnout <span className="tabular font-semibold">{t.pct}%</span>
                </span>
                <span className="t-small text-muted">Quorum {e.quorumPct}%</span>
              </span>
              <Progress value={t.pct} label="Turnout" />
            </div>
          )}
        </CardBody>
      </Card>

      {isStudent && e.status === "voting" && (
        <>
          {receipt ? (
            <Receipt code={receipt.code} at={receipt.at} title={e.title} />
          ) : !eligible ? (
            <Notice tone="warning" title="You cannot vote yet">
              Voting needs an enrolled status and a complete identity and studies section.{" "}
              <Link href="/profile" className="font-medium text-accent hover:underline">
                Finish your profile
              </Link>
            </Notice>
          ) : voting ? (
            <Ballot election={e} voter={me} onCancel={() => setVoting(false)} />
          ) : (
            <Card className="border-gold/60">
              <CardBody className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gold text-[#18181b]">
                  <Vote className="size-6" aria-hidden />
                </span>
                <div className="flex flex-1 flex-col">
                  <span className="font-semibold">Your ballot is ready</span>
                  <span className="t-small text-muted">
                    {officesForVoter(data, e, me).length} offices · closes {formatDate(e.votingCloses)} · takes about a minute
                  </span>
                </div>
                <Button variant="primary" onClick={() => setVoting(true)}>
                  Start voting
                </Button>
              </CardBody>
            </Card>
          )}
        </>
      )}

      {isStudent && e.status === "nominations" && <Nominate election={e} />}
      {isStudent && <SupporterRequests election={e} />}

      {e.status === "published" && (
        <Card>
          <CardHeader title="Results" description={e.publishedAt ? `Published ${formatDate(e.publishedAt)}` : undefined} />
          <CardBody>
            <Results election={e} />
          </CardBody>
        </Card>
      )}

      {e.status === "closed" && (
        <Notice tone="neutral" icon={Hourglass} title="Voting has closed">
          The officer and the scrutineer are checking the totals. Results appear here when published.
        </Notice>
      )}

      {showCandidates && !voting && (
        <section aria-labelledby="cands" className="flex flex-col gap-4">
          <h2 id="cands" className="t-label">
            Candidates
          </h2>
          {e.offices.map((o) => {
            const noms = e.nominations.filter((n) => n.officeId === o.id && n.status === "accepted");
            return (
              <Card key={o.id} className="overflow-hidden">
                <CardHeader title={o.name} description={o.city ? `Elected by members in ${o.city}` : "Elected by all members"} />
                <div className="mt-3 grid gap-px border-t border-border bg-border sm:grid-cols-2">
                  {noms.map((n) => {
                    const c = data.students.find((s) => s.id === n.studentId)!;
                    return (
                      <div key={n.id} className="flex gap-3 bg-surface p-4">
                        <Avatar name={fullName(c)} photo={c.photo} size={44} />
                        <div className="flex min-w-0 flex-col gap-1">
                          <span className="font-semibold">{fullName(c)}</span>
                          <span className="t-small text-muted">{uniOf(data, c)?.name}</span>
                          <p className="text-[14px] leading-6">“{n.statement}”</p>
                        </div>
                      </div>
                    );
                  })}
                  {noms.length === 0 && <p className="bg-surface p-4 text-muted">No accepted candidates.</p>}
                </div>
              </Card>
            );
          })}
        </section>
      )}

      {!isStudent && e.status === "voting" && (
        <p className="t-small text-muted">Only students see the ballot. Staff see turnout, never choices.</p>
      )}
    </div>
  );
}

function Nominate({ election }: { election: Election }) {
  const data = useDemo((s) => s.data);
  const nominate = useDemo((s) => s.nominate);
  const me = useCurrentStudent();
  const mine = election.nominations.find((n) => n.studentId === me.id);
  const offices = officesForVoter(data, election, me);
  const peers = eligibleVoters(data).filter((s) => s.id !== me.id);
  const [office, setOffice] = React.useState("");
  const [statement, setStatement] = React.useState("");
  const [proposer, setProposer] = React.useState("");
  const [seconder, setSeconder] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  if (mine) {
    const o = election.offices.find((x) => x.id === mine.officeId);
    return (
      <Card>
        <CardHeader label="Your nomination" title={o?.name} action={<StatusPill status={mine.status} />} />
        <CardBody className="flex flex-col gap-2 text-[14px]">
          <p>“{mine.statement}”</p>
          <p className="text-muted">
            Proposer {fullName(data.students.find((s) => s.id === mine.proposerId))}: {mine.proposerConfirmed ? "confirmed" : "waiting"} · Seconder{" "}
            {fullName(data.students.find((s) => s.id === mine.seconderId))}: {mine.seconderConfirmed ? "confirmed" : "waiting"}
          </p>
          {mine.reason && <p className="text-danger">“{mine.reason}”</p>}
        </CardBody>
      </Card>
    );
  }

  if (!canVote(data, me)) {
    return <Notice tone="warning" title="You cannot stand yet">Standing needs an enrolled status and a complete identity and studies section.</Notice>;
  }

  return (
    <Card>
      <CardHeader title="Stand for an office" description={`Nominations close ${formatDate(election.nominationsClose)}. You can stand for one office.`} />
      <CardBody className="flex flex-col gap-4">
        <Field label="Office" error={errors.office} required>
          <Select value={office} onChange={(e) => setOffice(e.target.value)}>
            <option value="">Choose an office</option>
            {offices.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Statement to voters" error={errors.statement} required hint="Up to 400 characters. Say what you will do, not who you are.">
          <Textarea value={statement} maxLength={400} onChange={(e) => setStatement(e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Proposer" error={errors.proposer} required hint="They confirm in their portal">
            <Select value={proposer} onChange={(e) => setProposer(e.target.value)}>
              <option value="">Choose a member</option>
              {peers.map((s) => (
                <option key={s.id} value={s.id}>
                  {fullName(s)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Seconder" error={errors.seconder} required>
            <Select value={seconder} onChange={(e) => setSeconder(e.target.value)}>
              <option value="">Choose a member</option>
              {peers
                .filter((s) => s.id !== proposer)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {fullName(s)}
                  </option>
                ))}
            </Select>
          </Field>
        </div>
      </CardBody>
      <CardFooter>
        <Button
          variant="primary"
          onClick={() => {
            const err: Record<string, string> = {};
            if (!office) err.office = "Choose the office you are standing for.";
            if (statement.trim().length < 40) err.statement = "Write at least a couple of sentences for voters.";
            if (!proposer) err.proposer = "Choose a proposer.";
            if (!seconder) err.seconder = "Choose a seconder.";
            setErrors(err);
            if (Object.keys(err).length) return;
            nominate(election.id, me.id, office, statement.trim(), proposer, seconder);
            toast("Nomination sent. Your proposer and seconder must confirm it.", { tone: "success" });
          }}
        >
          <UserPlus className="size-4" aria-hidden />
          Submit nomination
        </Button>
      </CardFooter>
    </Card>
  );
}

function SupporterRequests({ election }: { election: Election }) {
  const data = useDemo((s) => s.data);
  const confirmSupporter = useDemo((s) => s.confirmSupporter);
  const me = useCurrentStudent();
  const asks = election.nominations.filter(
    (n) => (n.proposerId === me.id && !n.proposerConfirmed) || (n.seconderId === me.id && !n.seconderConfirmed),
  );
  if (!asks.length || election.status !== "nominations") return null;
  return (
    <Card>
      <CardHeader title="You were named as a supporter" />
      <CardBody className="flex flex-col gap-3">
        {asks.map((n) => {
          const which = n.proposerId === me.id && !n.proposerConfirmed ? "proposer" : "seconder";
          return (
            <div key={n.id} className="flex flex-col gap-2 rounded-[10px] border border-border p-3 sm:flex-row sm:items-center">
              <span className="flex-1 text-[14px]">
                {fullName(data.students.find((s) => s.id === n.studentId))} for {election.offices.find((o) => o.id === n.officeId)?.name}, as {which}
              </span>
              <Button size="sm" variant="primary" onClick={() => confirmSupporter(election.id, n.id, which)}>
                Confirm
              </Button>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
