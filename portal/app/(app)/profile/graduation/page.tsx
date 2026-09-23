"use client";

import * as React from "react";
import { GraduationCap } from "@phosphor-icons/react";
import { useDemo, useCurrentStudent, toast } from "@/lib/store";
import { DEMO_STUDENT_ID } from "@/lib/constants";
import { formatDate, isoDateOnly } from "@/lib/utils";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { FileDrop, type PickedFile } from "@/components/FileDrop";
import { KeyValue, Notice, PageHeader } from "@/components/blocks";
import { StatusPill } from "@/components/StatusPill";
import { Guard } from "@/components/Guard";

export default function GraduationPage() {
  return (
    <Guard area="own-file">
      <Graduation />
    </Guard>
  );
}

function Graduation() {
  const s = useCurrentStudent();
  const saveGraduation = useDemo((x) => x.saveGraduation);
  const uploadDocument = useDemo((x) => x.uploadDocument);
  const g = s.graduation;
  const locked = g?.status === "sent" || g?.status === "confirmed";
  const [form, setForm] = React.useState({
    expectedFinish: isoDateOnly(g?.expectedFinish ?? s.studies.expectedFinish),
    leaveDate: isoDateOnly(g?.leaveDate),
    zwPhone: g?.zwPhone ?? s.contacts.phoneZw,
    zwTown: g?.zwTown ?? s.emergency.kinTown,
  });
  const [file, setFile] = React.useState<PickedFile | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function submit(send: boolean) {
    const err: Record<string, string> = {};
    if (!form.expectedFinish) err.expectedFinish = "Enter the date your studies end.";
    if (send) {
      if (!form.leaveDate) err.leaveDate = "Enter the date you plan to leave Russia.";
      if (!form.zwPhone.trim()) err.zwPhone = "Enter a Zimbabwe number where we can reach you after you leave.";
      if (!form.zwTown.trim()) err.zwTown = "Enter the town you are going back to.";
      if (!file && !g?.certificateFile) err.file = "Upload the degree certificate, or the university’s letter confirming completion.";
    }
    setErrors(err);
    if (Object.keys(err).length) return;
    if (file) uploadDocument(DEMO_STUDENT_ID, "degree-certificate", file.name, new Date().toISOString());
    saveGraduation(DEMO_STUDENT_ID, { ...form, certificateFile: file?.name ?? g?.certificateFile }, send);
    toast(send ? "Sent to a verifier for confirmation" : "Draft saved", { tone: "success" });
  }

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/profile", label: "Profile" }, { href: "/profile/graduation", label: "Graduation" }]}
        title="Graduation and return"
        description="Record how your studies end, so the association and the scholarship department can close your file properly."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader
            title="Your record"
            action={g ? <StatusPill status={g.status === "draft" ? "draft" : g.status} /> : <StatusPill status="not-started" />}
          />
          {locked ? (
            <CardBody className="flex flex-col gap-4">
              {g?.status === "confirmed" ? (
                <Notice tone="success" icon={GraduationCap} title="Confirmed">
                  Confirmed by {g.confirmedBy} on {formatDate(g.confirmedAt)}. Your semester history stays on file as an alumni record.
                </Notice>
              ) : (
                <Notice tone="info" title="Waiting for a verifier">
                  A verifier checks the certificate and confirms the record. You will get a notice.
                </Notice>
              )}
              <KeyValue
                items={[
                  ["Studies end", formatDate(g?.expectedFinish)],
                  ["Leaving Russia", formatDate(g?.leaveDate)],
                  ["Zimbabwe phone", g?.zwPhone],
                  ["Town", g?.zwTown],
                  ["Certificate", g?.certificateFile],
                ]}
              />
            </CardBody>
          ) : (
            <>
              <CardBody className="grid gap-4 sm:grid-cols-2">
                <Field label="Studies end" error={errors.expectedFinish} required>
                  <Input type="date" value={form.expectedFinish} onChange={(e) => setForm({ ...form, expectedFinish: e.target.value })} />
                </Field>
                <Field label="Date you leave Russia" error={errors.leaveDate} required>
                  <Input type="date" value={form.leaveDate} onChange={(e) => setForm({ ...form, leaveDate: e.target.value })} />
                </Field>
                <Field label="Zimbabwe phone" error={errors.zwPhone} required>
                  <Input type="tel" value={form.zwPhone} onChange={(e) => setForm({ ...form, zwPhone: e.target.value })} />
                </Field>
                <Field label="Town you are returning to" error={errors.zwTown} required>
                  <Input value={form.zwTown} onChange={(e) => setForm({ ...form, zwTown: e.target.value })} />
                </Field>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-[14px] font-medium">Degree certificate (required)</span>
                  <FileDrop value={file} onChange={setFile} error={errors.file} label="Drop the certificate here" />
                  {g?.certificateFile && !file && <span className="t-small text-muted">On file: {g.certificateFile}</span>}
                </div>
              </CardBody>
              <CardFooter>
                <Button variant="primary" onClick={() => submit(true)}>
                  Send for confirmation
                </Button>
                <Button variant="secondary" onClick={() => submit(false)}>
                  Save draft
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
        <Card>
          <CardBody className="flex flex-col gap-3 text-[14px] leading-6">
            <h2 className="font-semibold">What happens next</h2>
            <p>A verifier checks the certificate against your studies and confirms the record.</p>
            <p>Your profile then becomes an alumni record. You keep access to download your file.</p>
            <p className="text-muted">Before you leave, file a travel notice with the reason “End of studies”.</p>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
