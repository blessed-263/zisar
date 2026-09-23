"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Check, Question as HelpCircle, X } from "@phosphor-icons/react";
import { useDemo, withUndo } from "@/lib/store";
import { DOC_TYPES } from "@/lib/constants";
import { fullName, uniOf } from "@/lib/selectors";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/field";
import { Avatar, KeyValue, PageHeader } from "@/components/blocks";
import { StatusPill } from "@/components/StatusPill";
import { DOC_ICONS } from "@/components/DocumentTile";
import { Guard } from "@/components/Guard";
import NotFound from "@/app/not-found";

export default function DocReviewPage() {
  return (
    <Guard area="review">
      <DocReview />
    </Guard>
  );
}

function DocReview() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const data = useDemo((s) => s.data);
  const reviewDocument = useDemo((s) => s.reviewDocument);
  const doc = data.documents.find((d) => d.id === id);
  const [note, setNote] = React.useState("");
  const [error, setError] = React.useState<string>();
  if (!doc) return <NotFound />;
  const s = data.students.find((x) => x.id === doc.studentId)!;
  const meta = DOC_TYPES.find((d) => d.type === doc.type)!;
  const Icon = DOC_ICONS[doc.type];
  const history = data.documents.filter((d) => d.studentId === doc.studentId && d.type === doc.type).sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  const pending = doc.status === "received";

  function decide(decision: "verified" | "queried" | "rejected") {
    if (decision !== "verified" && note.trim().length < 10) return setError("Write the reason in a full sentence. The student sees it word for word.");
    withUndo(decision === "verified" ? "Document verified" : decision === "queried" ? "Query sent" : "Document rejected", () =>
      reviewDocument(doc!.id, decision, decision === "verified" ? note.trim() || undefined : note.trim()),
    );
    router.push("/admin/queue?tab=documents");
  }

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/admin/queue?tab=documents", label: "Documents" }, { href: `/admin/documents/${doc.id}`, label: meta.label }]}
        title={`${meta.label}`}
        description={`${fullName(s)} · ${uniOf(data, s)?.name}`}
        actions={<StatusPill status={doc.status} />}
      />
      <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
        <div className="grid min-h-[50dvh] place-items-center rounded-[12px] border border-border bg-surface-muted">
          <div className="flex flex-col items-center gap-3 text-muted">
            <Icon className="size-16" aria-hidden />
            <span className="font-mono text-[13px]">{doc.fileName}</span>
            <span className="t-small">Preview of the uploaded file</span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <CardBody className="flex items-center gap-3">
              <Avatar name={fullName(s)} photo={s.photo} size={44} />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="font-semibold">
                  {s.surname.toUpperCase()} {s.firstNames}
                </span>
                <span className="t-small font-mono text-muted">Passport {s.passport.number}</span>
              </div>
              <Link href={`/admin/students/${s.id}`} className="t-small text-accent hover:underline">
                Full file
              </Link>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Details entered by the student" />
            <CardBody>
              <KeyValue
                items={[
                  ["Issued", formatDate(doc.issued)],
                  ["Expires", meta.expiry ? formatDate(doc.expires) : "Does not expire"],
                  ["Uploaded", formatDateTime(doc.uploadedAt)],
                  ["Versions", String(history.length)],
                ]}
              />
            </CardBody>
          </Card>
          {pending ? (
            <Card>
              <CardHeader title="Decision" description="Check the dates on the file match what the student entered." />
              <CardBody>
                <Field label="Note to the student" error={error} hint="Required for a query or a rejection.">
                  <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
                </Field>
              </CardBody>
              <CardFooter>
                <Button variant="primary" onClick={() => decide("verified")}>
                  <Check className="size-4" aria-hidden />
                  Verified
                </Button>
                <Button variant="secondary" onClick={() => decide("queried")}>
                  <HelpCircle className="size-4" aria-hidden />
                  Send query
                </Button>
                <Button variant="destructive-outline" onClick={() => decide("rejected")}>
                  <X className="size-4" aria-hidden />
                  Reject
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardBody>
                Decided by {doc.reviewer}. {doc.note && <span className="text-muted">“{doc.note}”</span>}
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
