"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Check, CaretLeft as ChevronLeft, CaretRight as ChevronRight, Question as HelpCircle, Keyboard, X } from "@phosphor-icons/react";
import { useDemo, withUndo } from "@/lib/store";
import { OUTCOME_LABEL } from "@/lib/constants";
import { expiringItems, fullName, stageLabel, uniOf } from "@/lib/selectors";
import { formatDate } from "@/lib/utils";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Textarea } from "@/components/ui/field";
import { Sheet } from "@/components/ui/sheet";
import { Avatar, KeyValue, Notice, PageHeader } from "@/components/blocks";
import { StatusPill } from "@/components/StatusPill";
import { Timeline } from "@/components/Timeline";
import { Guard } from "@/components/Guard";
import { SheetPreview } from "@/components/semesters/SheetPreview";
import NotFound from "@/app/not-found";

const CHECKS = [
  "The name matches the passport on file",
  "The semester and academic year match this window",
  "The sheet carries the university stamp or a dean’s signature",
  "The grades match the declared outcome",
  "Every subject with arrears is listed",
];

export default function ReviewPage() {
  return (
    <Guard area="review">
      <Review />
    </Guard>
  );
}

function Review() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const data = useDemo((s) => s.data);
  const reviewSubmission = useDemo((s) => s.reviewSubmission);
  const sub = data.submissions.find((x) => x.id === id);
  const [checks, setChecks] = React.useState<boolean[]>(() => CHECKS.map(() => false));
  const [mode, setMode] = React.useState<"queried" | "rejected" | null>(null);
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [verifyHint, setVerifyHint] = React.useState(false);

  const queue = React.useMemo(
    () =>
      data.submissions
        .filter((x) => x.status === "submitted")
        .sort((a, b) => (a.events.at(-1)?.at ?? "").localeCompare(b.events.at(-1)?.at ?? ""))
        .map((x) => x.id),
    [data.submissions],
  );
  const idx = queue.indexOf(id);
  const prevId = idx > 0 ? queue[idx - 1] : undefined;
  const nextId = idx >= 0 ? queue[idx + 1] : queue[0];

  const decide = React.useCallback(
    (decision: "verified" | "queried" | "rejected", text?: string) => {
      if (!sub) return;
      const label = decision === "verified" ? "Marked verified" : decision === "queried" ? "Query sent" : "Rejected";
      withUndo(label, () => reviewSubmission(sub.id, decision, text));
      setMode(null);
      setReason("");
      const after = queue.filter((q) => q !== sub.id);
      const go = after[Math.max(0, idx)] ?? after[0];
      router.push(go ? `/admin/review/${go}` : "/admin/queue");
    },
    [sub, reviewSubmission, queue, idx, router],
  );

  const tryVerify = React.useCallback(() => {
    if (checks.every(Boolean)) decide("verified");
    else setVerifyHint(true);
  }, [checks, decide]);

  const pending = sub?.status === "submitted";

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement;
      if (mode || t.closest("input, textarea, select, [contenteditable]") || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "j" && nextId) router.push(`/admin/review/${nextId}`);
      else if (k === "k" && prevId) router.push(`/admin/review/${prevId}`);
      else if (!pending) return;
      else if (k === "v") tryVerify();
      else if (k === "q") setMode("queried");
      else if (k === "r") setMode("rejected");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, nextId, prevId, pending, router, tryVerify]);

  if (!sub) return <NotFound />;
  const s = data.students.find((x) => x.id === sub.studentId)!;
  const w = data.windows.find((x) => x.id === sub.windowId);
  const uni = uniOf(data, s);
  const expiring = expiringItems(s, 30);

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/admin/queue", label: "Queue" }, { href: `/admin/review/${sub.id}`, label: fullName(s) }]}
        title={fullName(s)}
        description={`${w?.name} · ${uni?.name}`}
        actions={
          <>
            <StatusPill status={sub.status} />
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" aria-label="Previous item (K)" disabled={!prevId} onClick={() => prevId && router.push(`/admin/review/${prevId}`)}>
                <ChevronLeft className="size-4" aria-hidden />
              </Button>
              <span className="tabular t-small text-muted">{idx >= 0 ? `${idx + 1} of ${queue.length}` : `${queue.length} waiting`}</span>
              <Button variant="ghost" size="icon-sm" aria-label="Next item (J)" disabled={!nextId} onClick={() => nextId && router.push(`/admin/review/${nextId}`)}>
                <ChevronRight className="size-4" aria-hidden />
              </Button>
            </div>
          </>
        }
      />

      {!pending && (
        <Notice tone="neutral" className="mb-4" title={sub.status === "queried" ? "Waiting for the student to reply" : `Decided${sub.decidedBy ? ` by ${sub.decidedBy}` : ""}`}>
          {sub.appeal?.status === "pending" ? "An appeal is open. The appeals officer decides it; the decision cannot be changed here." : "This item is not in the queue. It comes back if the student replies or an appeal returns it."}
        </Notice>
      )}

      <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
        <div className="h-[60dvh] lg:sticky lg:top-24 lg:h-[calc(100dvh-220px)]">
          <SheetPreview student={s} university={uni} sub={sub} windowName={w?.name ?? ""} fileName={sub.files.at(-1)?.name} />
        </div>

        <div className="flex flex-col gap-4 pb-24">
          <Card>
            <CardBody className="flex items-center gap-3">
              <Avatar name={fullName(s)} photo={s.photo} size={48} />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-semibold">
                  {s.surname.toUpperCase()} {s.firstNames}
                </span>
                <span className="t-small truncate text-muted">
                  {stageLabel(s)} · {s.studies.programme} · Cohort {s.scholarship.cohort}
                </span>
                <span className="t-small font-mono text-muted">Passport {s.passport.number}</span>
              </div>
              <Link href={`/admin/students/${s.id}`} className="t-small shrink-0 text-accent hover:underline">
                Full file
              </Link>
            </CardBody>
          </Card>

          <Card>
            <CardHeader label="Declared by the student" title={OUTCOME_LABEL[sub.outcome]} />
            <CardBody>
              <KeyValue
                items={[
                  ["Arrears", sub.arrears.length ? sub.arrears.map((a) => `${a.subject}${a.mark ? ` (${a.mark})` : ""}`).join(", ") : "None"],
                  ["Files", sub.files.map((f) => f.name).join(", ")],
                  ["Declaration", sub.declared ? "Confirmed" : "Not confirmed"],
                  ["Expiring soon", expiring.length ? expiring.map((e) => `${e.label} ${formatDate(e.date)}`).join(", ") : "Nothing in 30 days"],
                ]}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Checklist" description="Tick each point against the sheet before marking it verified." />
            <CardBody className="flex flex-col gap-1">
              {CHECKS.map((c, i) => (
                <Checkbox
                  key={c}
                  label={c}
                  checked={checks[i]}
                  disabled={!pending}
                  onChange={(v) => {
                    setChecks((x) => x.map((y, j) => (j === i ? v : y)));
                    setVerifyHint(false);
                  }}
                />
              ))}
              {verifyHint && (
                <p role="alert" className="t-small mt-1 text-warning">
                  Tick all five points to mark this verified, or send a query instead.
                </p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="History" />
            <CardBody>
              <Timeline events={sub.events} />
            </CardBody>
          </Card>
        </div>
      </div>

      {pending && (
        <div data-print="hide" className="fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-30 border-t border-border bg-surface/95 backdrop-blur md:bottom-0 md:left-16 lg:left-60">
          <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 md:px-8">
            <span className="t-small mr-auto hidden items-center gap-1.5 text-muted md:flex">
              <Keyboard className="size-4" aria-hidden />
              <kbd className="font-mono">V</kbd> verify · <kbd className="font-mono">Q</kbd> query · <kbd className="font-mono">R</kbd> reject · <kbd className="font-mono">J</kbd>/<kbd className="font-mono">K</kbd> move
            </span>
            <Button variant="destructive-outline" onClick={() => setMode("rejected")} className="flex-1 md:flex-none">
              <X className="size-4" aria-hidden />
              Reject
            </Button>
            <Button variant="secondary" onClick={() => setMode("queried")} className="flex-1 md:flex-none">
              <HelpCircle className="size-4" aria-hidden />
              Query
            </Button>
            <Button variant="primary" onClick={tryVerify} className="flex-1 md:flex-none">
              <Check className="size-4" aria-hidden />
              Verified
            </Button>
          </div>
        </div>
      )}

      <Sheet
        open={!!mode}
        onOpenChange={(o) => {
          if (!o) {
            setMode(null);
            setError(undefined);
          }
        }}
        title={mode === "queried" ? "Send a query" : "Reject this result"}
        description={
          mode === "queried"
            ? "The student replies on the same submission. They do not start again."
            : "The student sees your words exactly, and can submit again or appeal within 14 days."
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setMode(null)}>
              Cancel
            </Button>
            <Button
              variant={mode === "rejected" ? "destructive" : "primary"}
              onClick={() => {
                if (reason.trim().length < 10) return setError("Write the reason in a full sentence. The student sees it word for word.");
                decide(mode!, reason.trim());
              }}
            >
              {mode === "queried" ? "Send query" : "Reject result"}
            </Button>
          </>
        }
      >
        <Field label="Reason" error={error} required hint="Say what is wrong and what the student should do next.">
          <Textarea autoFocus value={reason} onChange={(e) => setReason(e.target.value)} className="min-h-36" />
        </Field>
      </Sheet>
    </>
  );
}
