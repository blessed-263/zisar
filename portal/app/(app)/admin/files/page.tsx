"use client";

import * as React from "react";
import { FileText, Scroll as ScrollText, UploadSimple as Upload } from "@phosphor-icons/react";
import { useDemo, withUndo } from "@/lib/store";
import type { AssocFile } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, RadioCards } from "@/components/ui/field";
import { Sheet } from "@/components/ui/sheet";
import { FileDrop, type PickedFile } from "@/components/FileDrop";
import { PageHeader, Row } from "@/components/blocks";
import { EmptyState } from "@/components/EmptyState";
import { Guard } from "@/components/Guard";

const KIND_LABEL: Record<AssocFile["kind"], string> = {
  constitution: "Constitution",
  "standing-rules": "Standing rules",
  minutes: "Minutes",
};

export default function FilesPage() {
  return (
    <Guard area="files-edit">
      <Files />
    </Guard>
  );
}

function Files() {
  const files = useDemo((s) => s.data.files);
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <PageHeader
        label="Admin"
        title="Constitution and minutes"
        description="Files here are listed on the public elections page. A new version sits above the old one; nothing is deleted."
        actions={
          <Button variant="primary" onClick={() => setOpen(true)}>
            <Upload className="size-4" aria-hidden />
            File a document
          </Button>
        }
      />
      {files.length ? (
        <Card className="overflow-hidden divide-y divide-border">
          {files.map((f) => (
            <Row
              key={f.id}
              icon={f.kind === "minutes" ? FileText : ScrollText}
              title={f.title}
              meta={`${KIND_LABEL[f.kind]} · ${f.fileName} · filed by ${f.uploadedBy}, ${formatDate(f.at)}`}
            />
          ))}
        </Card>
      ) : (
        <EmptyState icon={ScrollText} title="No files yet. File the constitution first." />
      )}
      <UploadSheet open={open} onOpenChange={setOpen} />
    </>
  );
}

function UploadSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const upload = useDemo((s) => s.uploadAssocFile);
  const [kind, setKind] = React.useState<AssocFile["kind"]>("minutes");
  const [title, setTitle] = React.useState("");
  const [file, setFile] = React.useState<PickedFile | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function submit() {
    const err: Record<string, string> = {};
    if (!title.trim()) err.title = "Give the file a title, for example Minutes, general meeting, 12 Oct 2026.";
    if (!file) err.file = "Choose the PDF to file.";
    setErrors(err);
    if (Object.keys(err).length) return;
    withUndo(`${title.trim()} filed.`, () => upload({ kind, title: title.trim(), fileName: file!.name }));
    setTitle("");
    setFile(null);
    onOpenChange(false);
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="File a document"
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit}>
            File document
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <RadioCards<AssocFile["kind"]>
          name="kind"
          value={kind}
          onChange={setKind}
          columns={3}
          options={(Object.keys(KIND_LABEL) as AssocFile["kind"][]).map((k) => ({ value: k, label: KIND_LABEL[k] }))}
        />
        <Field label="Title" error={errors.title} required>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <FileDrop value={file} onChange={setFile} accept="application/pdf" label="Drop the PDF" hint="PDF, up to 10 MB" error={errors.file} />
      </div>
    </Sheet>
  );
}
