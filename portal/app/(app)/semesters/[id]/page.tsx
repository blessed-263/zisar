"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Calendar as CalendarClock, CheckCircle as CheckCircle2, Question as HelpCircle, Lock, Scales as Scale, XCircle } from "@phosphor-icons/react";
import { useDemo, useCurrentStudent, toast } from "@/lib/store";
import { APPEAL_DAYS, DEMO_STUDENT_ID, OUTCOME_LABEL } from "@/lib/constants";
import { submissionFor, windowIsOpen, windowStateFor } from "@/lib/selectors";
import type { Outcome, Submission } from "@/lib/types";
import { addDays, daysUntil, formatDate, relativeDays } from "@/lib/utils";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, RadioCards, Textarea } from "@/components/ui/field";
import { Sheet } from "@/components/ui/sheet";
import { FileDrop, type PickedFile } from "@/components/FileDrop";
import { KeyValue, Notice, PageHeader } from "@/components/blocks";
import { StatusPill } from "@/components/StatusPill";
import { Timeline } from "@/components/Timeline";
import { Guard } from "@/components/Guard";
import { ArrearsEditor } from "@/components/semesters/ArrearsEditor";
import NotFound from "@/app/not-found";

export default function SemesterPage() {
  return (
    <Guard area="own-file">
      <Semester />
    </Guard>
  );
}

function lastText(sub: Submission, kind: "queried" | "rejected") {
  return [...sub.events].reverse().find((e) => e.kind === kind)?.text;
}

function Semester() {
  const { id } = useParams<{ id: string }>();
  const data = useDemo((s) => s.data);
  const s = useCurrentStudent();
  const w = data.windows.find((x) => x.id === id);
  const [resubmitting, setResubmitting] = React.useState(false);
  const [appealOpen, setAppealOpen] = React.useState(false);
  if (!w) return <NotFound />;
  const sub = submissionFor(data, w.id, s.id);
  const state = windowStateFor(data, w, s);
  const open = windowIsOpen(w);
  const appealDue = sub?.decidedAt ? addDays(APPEAL_DAYS, new Date(sub.decidedAt)) : undefined;
  const canAppeal = sub?.status === "rejected" && !sub.appeal && appealDue && daysUntil(appealDue) >= 0;
  const showForm = open && (!sub || sub.status === "draft" || (sub.status === "rejected" && resubmitting && !sub.appeal));

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/semesters", label: "Semesters" }, { href: `/semesters/${w.id}`, label: w.name }]}
        title={w.name}
        description={
          open ? (
            <>
              Due {formatDate(w.deadline)} · {relativeDays(w.deadline)}
            </>
          ) : (
            `Closed on ${formatDate(w.deadline)}`
          )
        }
        actions={<StatusPill status={state} />}
      />

      {w.poster && (
         
        <img src={w.poster} alt="" className="mb-6 aspect-[16/5] w-full rounded-[12px] border border-border object-cover" />
      )}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-6">
          {sub?.status === "queried" && <QueryReply sub={sub} replyDays={w.replyDays} />}

          {sub?.status === "rejected" && !resubmitting && (
            <Notice tone="danger" icon={XCircle} title="Your result was rejected">
              <p>“{lastText(sub, "rejected")}”</p>
              <p className="mt-2 text-text">
                {sub.appeal
                  ? sub.appeal.status === "pending"
                    ? "Your appeal is with the appeals officer. You will get a notice when it is decided."
                    : `Appeal decided: ${sub.appeal.status === "upheld" ? "the decision stands" : "sent back for a fresh review"}.`
                  : open
                    ? `You can submit again while the window is open, or appeal by ${formatDate(appealDue)}.`
                    : canAppeal
                      ? `The window is closed. You can appeal by ${formatDate(appealDue)}.`
                      : "The appeal period has ended."}
              </p>
              {(open || canAppeal) && !sub.appeal && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {open && (
                    <Button variant="primary" size="sm" onClick={() => setResubmitting(true)}>
                      Submit again
                    </Button>
                  )}
                  {canAppeal && (
                    <Button variant={open ? "secondary" : "primary"} size="sm" onClick={() => setAppealOpen(true)}>
                      <Scale className="size-4" aria-hidden />
                      Appeal this decision
                    </Button>
                  )}
                </div>
              )}
            </Notice>
          )}

          {sub?.appeal && (
            <Card>
              <CardHeader
                label="Appeal"
                title={sub.appeal.status === "pending" ? "With the appeals officer" : sub.appeal.status === "upheld" ? "Decision upheld" : "Sent back for review"}
                action={<StatusPill status={sub.appeal.status === "pending" ? "pending" : sub.appeal.status} />}
              />
              <CardBody>
                <KeyValue
                  items={[
                    ["Your reason", `“${sub.appeal.reason}”`],
                    ["Submitted", formatDate(sub.appeal.submittedAt)],
                    ...(sub.appeal.note ? ([["Officer’s note", `“${sub.appeal.note}”`]] as [string, string][]) : []),
                    ...(sub.appeal.officer ? ([["Decided by", sub.appeal.officer]] as [string, string][]) : []),
                  ]}
                />
              </CardBody>
            </Card>
          )}

          {showForm && <SubmitForm windowId={w.id} existing={sub?.status === "draft" ? sub : undefined} instruction={w.instruction} onDone={() => setResubmitting(false)} />}

          {!sub && !open && (
            <Notice tone="neutral" icon={CalendarClock} title="Nothing was submitted for this semester">
              The window closed on {formatDate(w.deadline)}. Contact a verifier if you believe this is wrong.
            </Notice>
          )}

          {sub && (sub.status === "submitted" || sub.status === "verified") && (
            <Card>
              <CardHeader
                title={sub.status === "verified" ? "Verified" : "Submitted, waiting for a verifier"}
                description={sub.status === "verified" ? `By ${sub.decidedBy} on ${formatDate(sub.decidedAt)}. This semester is closed on your profile.` : "You can still see what you sent. It cannot be changed while it is being checked."}
                action={sub.status === "verified" ? <CheckCircle2 className="size-6 text-success" aria-hidden /> : <Lock className="size-5 text-muted" aria-hidden />}
              />
              <CardBody>
                <Summary sub={sub} />
              </CardBody>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader title="History" description="Every step, with the verifier’s words." />
          <CardBody>
            {sub ? <Timeline events={sub.events} /> : <p className="text-muted">Nothing yet.</p>}
          </CardBody>
        </Card>
      </div>

      {sub && <AppealSheet open={appealOpen} onOpenChange={setAppealOpen} subId={sub.id} />}
    </>
  );
}

function Summary({ sub }: { sub: Submission }) {
  return (
    <KeyValue
      items={[
        ["Declared outcome", OUTCOME_LABEL[sub.outcome]],
        ["Files", sub.files.map((f) => f.name).join(", ")],
        ...(sub.arrears.length ? ([["Arrears", sub.arrears.map((a) => `${a.subject}${a.mark ? ` (${a.mark})` : ""}`).join(", ")]] as [string, string][]) : []),
      ]}
    />
  );
}

function SubmitForm({
  windowId,
  existing,
  instruction,
  onDone,
}: {
  windowId: string;
  existing?: Submission;
  instruction: string;
  onDone: () => void;
}) {
  const saveSubmission = useDemo((s) => s.saveSubmission);
  const [outcome, setOutcome] = React.useState<Outcome | undefined>(existing?.outcome);
  const [arrears, setArrears] = React.useState(existing?.arrears ?? []);
  const [file, setFile] = React.useState<PickedFile | null>(null);
  const [declared, setDeclared] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [busy, setBusy] = React.useState(false);
  const existingFile = existing?.files.at(-1)?.name;

  function go(submit: boolean) {
    const err: Record<string, string> = {};
    if (!outcome) err.outcome = "Choose the outcome shown on your result sheet.";
    if (submit) {
      if (!file && !existingFile) err.file = "Upload the official result sheet, stamped or signed by the dean’s office.";
      if (outcome && outcome !== "satisfactory" && arrears.filter((a) => a.subject.trim()).length === 0) err.arrears = "List each subject with arrears.";
      if (!declared) err.declared = "Confirm the declaration before you submit.";
    }
    setErrors(err);
    if (Object.keys(err).length) return;
    setBusy(true);
    setTimeout(() => {
      saveSubmission(windowId, DEMO_STUDENT_ID, { outcome: outcome!, arrears: outcome === "satisfactory" ? [] : arrears.filter((a) => a.subject.trim()), fileName: file?.name, declared }, submit);
      setBusy(false);
      toast(submit ? "Submitted. A verifier will check it." : "Draft saved", { tone: "success" });
      if (submit) onDone();
    }, 450);
  }

  return (
    <Card>
      <CardHeader title={existing ? "Finish your submission" : "Submit your results"} description={instruction} />
      <CardBody className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <span className="text-[14px] font-medium">Outcome on the sheet (required)</span>
          <RadioCards<Outcome>
            name="outcome"
            value={outcome}
            onChange={setOutcome}
            options={[
              { value: "satisfactory", label: "Satisfactory", description: "Every subject passed" },
              { value: "arrears", label: "Satisfactory with arrears", description: "One or more subjects to retake" },
              { value: "unsatisfactory", label: "Unsatisfactory", description: "The semester was not passed" },
            ]}
          />
          {errors.outcome && (
            <p role="alert" className="t-small text-danger">
              {errors.outcome}
            </p>
          )}
        </div>
        {outcome && outcome !== "satisfactory" && <ArrearsEditor value={arrears} onChange={setArrears} error={errors.arrears} />}
        <div className="flex flex-col gap-1.5">
          <span className="text-[14px] font-medium">Result sheet (required)</span>
          <FileDrop value={file} onChange={setFile} error={errors.file} label="Drop your result sheet here" />
          {existingFile && !file && <span className="t-small text-muted">Already attached: {existingFile}</span>}
        </div>
        <div>
          <Checkbox
            checked={declared}
            onChange={setDeclared}
            label="I declare that this is my official result sheet for this semester, and that the outcome above matches it."
          />
          {errors.declared && (
            <p role="alert" className="t-small ml-8 text-danger">
              {errors.declared}
            </p>
          )}
        </div>
      </CardBody>
      <CardFooter>
        <Button variant="primary" onClick={() => go(true)} loading={busy}>
          Submit for verification
        </Button>
        <Button variant="secondary" onClick={() => go(false)} disabled={busy}>
          Save draft
        </Button>
      </CardFooter>
    </Card>
  );
}

function QueryReply({ sub, replyDays }: { sub: Submission; replyDays: number }) {
  const replyToQuery = useDemo((s) => s.replyToQuery);
  const q = [...sub.events].reverse().find((e) => e.kind === "queried");
  const due = q ? addDays(replyDays, new Date(q.at)) : undefined;
  const [text, setText] = React.useState("");
  const [file, setFile] = React.useState<PickedFile | null>(null);
  const [error, setError] = React.useState<string>();
  return (
    <Card className="border-warning/30">
      <CardHeader
        label={`Question from ${q?.by ?? "the verifier"}`}
        title="Reply on this submission"
        description={due ? `Reply by ${formatDate(due)}. You do not need to start again.` : undefined}
        action={<HelpCircle className="size-6 text-warning" aria-hidden />}
      />
      <CardBody className="flex flex-col gap-4">
        <blockquote className="rounded-[10px] border-l-[3px] border-warning bg-warning-soft px-4 py-3 text-[15px] leading-6">“{q?.text}”</blockquote>
        <Field label="Your reply" error={error} required>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} />
        </Field>
        <div className="flex flex-col gap-1.5">
          <span className="text-[14px] font-medium">
            Add a file <span className="font-normal text-muted">(optional)</span>
          </span>
          <FileDrop value={file} onChange={setFile} label="Drop the corrected sheet here" />
        </div>
      </CardBody>
      <CardFooter>
        <Button
          variant="primary"
          onClick={() => {
            if (!text.trim()) return setError("Write a short reply so the verifier knows what changed.");
            replyToQuery(sub.id, file?.name, text.trim());
            toast("Reply sent. The submission is back with the verifier.", { tone: "success" });
          }}
        >
          Send reply
        </Button>
      </CardFooter>
    </Card>
  );
}

function AppealSheet({ open, onOpenChange, subId }: { open: boolean; onOpenChange: (o: boolean) => void; subId: string }) {
  const appeal = useDemo((s) => s.appeal);
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState<string>();
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Appeal this decision"
      description="An appeals officer who did not make the original decision reads your reason and the sheet."
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (reason.trim().length < 20) return setError("Explain why the decision is wrong in a sentence or two.");
              appeal(subId, reason.trim());
              onOpenChange(false);
              toast("Appeal sent to the appeals officer", { tone: "success" });
            }}
          >
            Send appeal
          </Button>
        </>
      }
    >
      <Field label="Why the decision should change" error={error} required hint="Refer to what is on the sheet. You can attach a new file after the officer replies.">
        <Textarea value={reason} onChange={(e) => setReason(e.target.value)} className="min-h-36" />
      </Field>
    </Sheet>
  );
}
