"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowCounterClockwise as RotateCcw, Scales as Scale } from "@phosphor-icons/react";
import { useDemo, withUndo } from "@/lib/store";
import { OUTCOME_LABEL } from "@/lib/constants";
import { fullName, uniOf } from "@/lib/selectors";
import { formatDate } from "@/lib/utils";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/field";
import { Tabs } from "@/components/ui/tabs";
import { Avatar, KeyValue, Notice, PageHeader } from "@/components/blocks";
import { StatusPill } from "@/components/StatusPill";
import { Timeline } from "@/components/Timeline";
import { EmptyState } from "@/components/EmptyState";
import { Guard } from "@/components/Guard";
import { cn } from "@/lib/utils";

export default function AppealsPage() {
  return (
    <Guard area="appeals">
      <Appeals />
    </Guard>
  );
}

function Appeals() {
  const data = useDemo((s) => s.data);
  const decideAppeal = useDemo((s) => s.decideAppeal);
  const params = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = React.useState<"pending" | "decided">("pending");
  const all = data.submissions.filter((s) => s.appeal);
  const list = all.filter((s) => (tab === "pending" ? s.appeal!.status === "pending" : s.appeal!.status !== "pending"));
  const selectedId = params.get("id") ?? list[0]?.id;
  const sel = all.find((s) => s.id === selectedId);
  const [note, setNote] = React.useState("");
  const [error, setError] = React.useState<string>();

  function decide(decision: "upheld" | "returned") {
    if (!sel) return;
    if (note.trim().length < 10) return setError("Explain the decision. The student sees your words exactly.");
    withUndo(decision === "upheld" ? "Decision upheld" : "Returned to the verifier queue", () => decideAppeal(sel.id, decision, note.trim()));
    setNote("");
    setError(undefined);
    router.replace("/admin/appeals");
  }

  return (
    <>
      <PageHeader label="Appeals officer" title="Appeals" description="The original decision cannot be edited here. You either uphold it or send it back for a fresh review." />
      <Tabs
        label="Appeals"
        value={tab}
        onChange={(v) => {
          setTab(v);
          router.replace("/admin/appeals");
        }}
        className="mb-4"
        items={[
          { value: "pending", label: "Waiting", count: all.filter((s) => s.appeal!.status === "pending").length },
          { value: "decided", label: "Decided", count: all.filter((s) => s.appeal!.status !== "pending").length },
        ]}
      />
      {list.length === 0 ? (
        <EmptyState icon={Scale} title={tab === "pending" ? "No appeals are waiting." : "No appeals have been decided yet."} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <Card className="divide-y divide-border self-start overflow-hidden">
            {list.map((sub) => {
              const s = data.students.find((x) => x.id === sub.studentId)!;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => router.replace(`/admin/appeals?id=${sub.id}`, { scroll: false })}
                  aria-current={sub.id === sel?.id}
                  className={cn("flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface-muted", sub.id === sel?.id && "bg-accent-soft")}
                >
                  <Avatar name={fullName(s)} photo={s.photo} size={32} />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium">{fullName(s)}</span>
                    <span className="t-small truncate text-muted">{data.windows.find((w) => w.id === sub.windowId)?.name}</span>
                  </span>
                  <StatusPill status={sub.appeal!.status === "pending" ? "pending" : sub.appeal!.status} size="sm" />
                </button>
              );
            })}
          </Card>

          {sel && (
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader
                  label="Original decision"
                  title={`${sel.status === "rejected" ? "Rejected" : sel.status[0].toUpperCase() + sel.status.slice(1)} by ${sel.decidedBy ?? "a verifier"}`}
                  description={`${fullName(data.students.find((x) => x.id === sel.studentId))} · ${uniOf(data, data.students.find((x) => x.id === sel.studentId))?.name} · ${formatDate(sel.decidedAt)}`}
                  action={<Lock className="size-5 text-muted" aria-label="Cannot be edited" />}
                />
                <CardBody>
                  <KeyValue
                    items={[
                      ["Declared outcome", OUTCOME_LABEL[sel.outcome]],
                      ["Verifier’s reason", `“${[...sel.events].reverse().find((e) => e.kind === "rejected")?.text ?? ""}”`],
                      ["Files", sel.files.map((f) => f.name).join(", ")],
                    ]}
                  />
                </CardBody>
              </Card>
              <Notice tone="info" icon={Scale} title="The student’s appeal">
                <p>“{sel.appeal!.reason}”</p>
                <p className="t-small mt-1 text-muted">Submitted {formatDate(sel.appeal!.submittedAt)}</p>
              </Notice>
              {sel.appeal!.status === "pending" ? (
                <Card>
                  <CardHeader title="Your decision" />
                  <CardBody>
                    <Field label="Note to the student" error={error} required hint="Quoted word for word in their notice.">
                      <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
                    </Field>
                  </CardBody>
                  <CardFooter>
                    <Button variant="primary" onClick={() => decide("returned")}>
                      <RotateCcw className="size-4" aria-hidden />
                      Return to queue
                    </Button>
                    <Button variant="secondary" onClick={() => decide("upheld")}>
                      Uphold decision
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardBody>
                    <span className="font-medium">{sel.appeal!.status === "upheld" ? "Upheld" : "Returned to queue"}</span> by {sel.appeal!.officer} on {formatDate(sel.appeal!.decidedAt)}.
                    <p className="text-muted">“{sel.appeal!.note}”</p>
                  </CardBody>
                </Card>
              )}
              <Card>
                <CardHeader title="History" />
                <CardBody>
                  <Timeline events={sel.events} />
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      )}
    </>
  );
}
