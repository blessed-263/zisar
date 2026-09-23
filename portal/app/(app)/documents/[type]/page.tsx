"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { FileText, UploadSimple as Upload } from "@phosphor-icons/react";
import { useDemo, useCurrentStudent, toast } from "@/lib/store";
import { DOC_TYPES, DEMO_STUDENT_ID } from "@/lib/constants";
import { currentDocs, currentVersion, expiryState } from "@/lib/selectors";
import type { DocType } from "@/lib/types";
import { formatDate, formatDateTime, relativeDays } from "@/lib/utils";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Sheet } from "@/components/ui/sheet";
import { FileDrop, type PickedFile } from "@/components/FileDrop";
import { KeyValue, Notice, PageHeader } from "@/components/blocks";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { DOC_ICONS } from "@/components/DocumentTile";
import { Guard } from "@/components/Guard";
import NotFound from "@/app/not-found";

export default function DocumentPage() {
  return (
    <Guard area="own-file">
      <DocumentDetail />
    </Guard>
  );
}

function DocumentDetail() {
  const { type } = useParams<{ type: string }>();
  const meta = DOC_TYPES.find((d) => d.type === type);
  const data = useDemo((s) => s.data);
  const s = useCurrentStudent();
  const [open, setOpen] = React.useState(false);
  if (!meta) return <NotFound />;
  const versions = currentDocs(data, s.id).get(meta.type) ?? [];
  const current = currentVersion(versions);
  const latest = versions[0];
  const exp = expiryState(current?.expires);
  const Icon = DOC_ICONS[meta.type];

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/documents", label: "Documents" }, { href: `/documents/${meta.type}`, label: meta.label }]}
        title={meta.label}
        description={`When it is needed: ${meta.when}`}
        actions={
          <Button variant="primary" onClick={() => setOpen(true)}>
            <Upload className="size-4" aria-hidden />
            {versions.length ? "Upload a new version" : "Upload"}
          </Button>
        }
      />

      {latest && latest.status !== "verified" && latest.status !== "received" && latest.note && (
        <Notice tone={latest.status === "rejected" ? "danger" : "warning"} title={latest.status === "rejected" ? "The last upload was rejected" : "The verifier has a question"} className="mb-6">
          <p>“{latest.note}”</p>
          <p className="mt-1 text-muted">Upload a corrected version. The earlier one stays in the history.</p>
        </Notice>
      )}
      {exp === "expiring" && current?.expires && (
        <Notice tone="warning" title={`Expires ${formatDate(current.expires)}, ${relativeDays(current.expires)}`} className="mb-6">
          Start the renewal now. Upload the new one as soon as you have it.
        </Notice>
      )}
      {exp === "expired" && current?.expires && (
        <Notice tone="danger" title={`Expired on ${formatDate(current.expires)}`} className="mb-6">
          Upload the renewed document. If you are stuck, ask the welfare office for help.
        </Notice>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHeader label="Current" title={current ? current.fileName : "Nothing on file"} action={current && <StatusPill status={current.status} />} />
          <CardBody>
            {current ? (
              <div className="flex flex-col gap-4">
                <div className="grid aspect-[4/3] place-items-center rounded-[10px] border border-border bg-surface-muted">
                  <Icon className="size-12 text-muted/60" aria-hidden />
                </div>
                <KeyValue
                  items={[
                    ["Issued", formatDate(current.issued)],
                    ["Expires", meta.expiry ? formatDate(current.expires) : "Does not expire"],
                    ["Uploaded", formatDate(current.uploadedAt)],
                    ["Checked by", current.reviewer ?? "Waiting for a verifier"],
                  ]}
                />
              </div>
            ) : (
              <EmptyState
                icon={FileText}
                title={meta.required ? "This document is required. Upload a clear scan or photo." : "Upload it when you have it."}
                action={
                  <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
                    Upload
                  </Button>
                }
              />
            )}
          </CardBody>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader title="Version history" description={`${versions.length} ${versions.length === 1 ? "version" : "versions"}, newest first`} />
          <ol className="mt-3 divide-y divide-border border-t border-border">
            {versions.length === 0 && <li className="px-5 py-4 text-muted">No versions yet.</li>}
            {versions.map((v, i) => (
              <li key={v.id} className="flex flex-col gap-1.5 px-4 py-3.5 md:px-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="tabular t-small shrink-0 rounded-[6px] bg-surface-muted px-1.5 font-mono text-muted">v{versions.length - i}</span>
                    <span className="truncate font-medium">{v.fileName}</span>
                  </span>
                  <StatusPill status={v.status} size="sm" />
                </div>
                <span className="t-small text-muted">
                  Uploaded {formatDateTime(v.uploadedAt)}
                  {v.expires ? ` · expires ${formatDate(v.expires)}` : ""}
                  {v.reviewer ? ` · ${v.reviewer}` : ""}
                </span>
                {v.note && <p className="rounded-[8px] bg-surface-muted px-3 py-2 text-[14px]">“{v.note}”</p>}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <UploadSheet open={open} onOpenChange={setOpen} type={meta.type} label={meta.label} tracksExpiry={meta.expiry} />
    </>
  );
}

function UploadSheet({
  open,
  onOpenChange,
  type,
  label,
  tracksExpiry,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  type: DocType;
  label: string;
  tracksExpiry: boolean;
}) {
  const uploadDocument = useDemo((s) => s.uploadDocument);
  const [file, setFile] = React.useState<PickedFile | null>(null);
  const [issued, setIssued] = React.useState("");
  const [expires, setExpires] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [busy, setBusy] = React.useState(false);

  const [wasOpen, setWasOpen] = React.useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (!open) {
      setFile(null);
      setIssued("");
      setExpires("");
      setErrors({});
    }
  }

  function submit() {
    const err: Record<string, string> = {};
    if (!file) err.file = "Choose the file to upload.";
    if (!issued) err.issued = "Enter the date on the document.";
    if (tracksExpiry && !expires) err.expires = "Enter the expiry date printed on the document.";
    if (tracksExpiry && expires && issued && expires <= issued) err.expires = "The expiry date must be after the issue date.";
    setErrors(err);
    if (Object.keys(err).length) return;
    setBusy(true);
    setTimeout(() => {
      uploadDocument(DEMO_STUDENT_ID, type, file!.name, issued, tracksExpiry ? expires : undefined);
      setBusy(false);
      onOpenChange(false);
      toast(`${label} uploaded. A verifier will check it.`, { tone: "success" });
    }, 500);
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={`Upload ${label.toLowerCase()}`}
      description="The file stays on this device in the demo."
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit} loading={busy}>
            Upload
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FileDrop value={file} onChange={setFile} error={errors.file} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Issue date" error={errors.issued} required>
            <Input type="date" value={issued} onChange={(e) => setIssued(e.target.value)} />
          </Field>
          {tracksExpiry && (
            <Field label="Expiry date" error={errors.expires} required hint="We remind you 60 days before">
              <Input type="date" value={expires} onChange={(e) => setExpires(e.target.value)} />
            </Field>
          )}
        </div>
      </div>
    </Sheet>
  );
}
