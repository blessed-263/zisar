"use client";

import * as React from "react";
import { CalendarPlus, GraduationCap } from "@phosphor-icons/react";
import { useDemo, withUndo } from "@/lib/store";
import { windowAppliesTo, windowIsOpen, windowStateFor } from "@/lib/selectors";
import type { SemesterWindow } from "@/lib/types";
import { fileToDataUrl, formatDate, relativeDays } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, RadioCards, Textarea } from "@/components/ui/field";
import { Sheet } from "@/components/ui/sheet";
import { FileDrop, type PickedFile } from "@/components/FileDrop";
import { PageHeader } from "@/components/blocks";
import { StatusPill } from "@/components/StatusPill";
import { Guard } from "@/components/Guard";

export default function WindowsPage() {
  return (
    <Guard area="windows">
      <Windows />
    </Guard>
  );
}

function Windows() {
  const data = useDemo((s) => s.data);
  const [open, setOpen] = React.useState(false);
  const windows = [...data.windows].sort((a, b) => b.opens.localeCompare(a.opens));
  return (
    <>
      <PageHeader
        label="Admin"
        title="Semester windows"
        description="A window is the period in which students submit one semester’s results."
        actions={
          <Button variant="primary" onClick={() => setOpen(true)}>
            <CalendarPlus className="size-4" aria-hidden />
            Open a new window
          </Button>
        }
      />
      <div className="flex flex-col gap-3">
        {windows.map((w) => {
          const expected = data.students.filter((s) => windowAppliesTo(w, s));
          const states = expected.map((s) => windowStateFor(data, w, s));
          const count = (k: string) => states.filter((x) => x === k).length;
          const isOpen = windowIsOpen(w);
          return (
            <Card key={w.id} className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-[10px] bg-accent-soft text-accent">
                <GraduationCap className="size-5" aria-hidden />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="flex items-center gap-2 font-semibold">
                  {w.name}
                  <StatusPill status={isOpen ? "open" : "closed"} size="sm" />
                </span>
                <span className="t-small text-muted">
                  {formatDate(w.opens)} to {formatDate(w.deadline)}
                  {isOpen ? ` · closes ${relativeDays(w.deadline)}` : ""} · {w.scope === "all" ? "All students" : w.scope === "preparatory" ? "Preparatory year" : "Degree students"} · replies within {w.replyDays} days
                </span>
              </div>
              <dl className="tabular grid grid-cols-4 gap-4 text-center text-[13px]">
                {[
                  ["Expected", expected.length],
                  ["Verified", count("verified")],
                  ["Waiting", count("submitted") + count("queried")],
                  ["Overdue", count("overdue")],
                ].map(([k, v]) => (
                  <div key={k as string}>
                    <dt className="text-muted">{k}</dt>
                    <dd className="text-[18px] font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          );
        })}
      </div>
      <OpenWindowSheet open={open} onOpenChange={setOpen} />
    </>
  );
}

function OpenWindowSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const openWindow = useDemo((s) => s.openWindow);
  const [f, setF] = React.useState<Omit<SemesterWindow, "id" | "poster">>({
    name: "Spring 2026/27 session",
    scope: "all",
    opens: new Date().toISOString().slice(0, 10),
    deadline: "",
    instruction: "Upload the official result sheet for the spring session, stamped by the dean’s office. List every subject with arrears.",
    replyDays: 7,
  });
  const [poster, setPoster] = React.useState<PickedFile | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  async function submit() {
    const err: Record<string, string> = {};
    if (!f.name.trim()) err.name = "Name the window, for example Spring 2026/27 session.";
    if (!f.deadline) err.deadline = "Choose the deadline.";
    else if (f.deadline <= f.opens) err.deadline = "The deadline must be after the opening date.";
    if (!f.instruction.trim()) err.instruction = "Tell students exactly what to upload.";
    setErrors(err);
    if (Object.keys(err).length) return;
    const img = poster ? await fileToDataUrl(poster.file, 1200) : undefined;
    withUndo(`${f.name} opened. Every student was notified.`, () => openWindow({ ...f, poster: img }));
    onOpenChange(false);
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Open a semester window"
      description="Every student it applies to gets a notice."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit}>
            Open window
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Name" error={errors.name} required>
          <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        </Field>
        <div className="flex flex-col gap-1.5">
          <span className="text-[14px] font-medium">Who submits</span>
          <RadioCards<SemesterWindow["scope"]>
            name="scope"
            value={f.scope}
            onChange={(scope) => setF({ ...f, scope })}
            columns={3}
            options={[
              { value: "all", label: "All students" },
              { value: "degree", label: "Degree students" },
              { value: "preparatory", label: "Preparatory year" },
            ]}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Opens" required>
            <Input type="date" value={f.opens} onChange={(e) => setF({ ...f, opens: e.target.value })} />
          </Field>
          <Field label="Deadline" error={errors.deadline} required>
            <Input type="date" value={f.deadline} onChange={(e) => setF({ ...f, deadline: e.target.value })} />
          </Field>
          <Field label="Days to reply to a query" required>
            <Input type="number" min={1} max={30} value={f.replyDays} onChange={(e) => setF({ ...f, replyDays: Number(e.target.value) })} />
          </Field>
        </div>
        <Field label="Instruction to students" error={errors.instruction} required>
          <Textarea value={f.instruction} onChange={(e) => setF({ ...f, instruction: e.target.value })} />
        </Field>
        <div className="flex flex-col gap-1.5">
          <span className="text-[14px] font-medium">
            Poster <span className="font-normal text-muted">(optional)</span>
          </span>
          <FileDrop value={poster} onChange={setPoster} imageOnly label="Drop a poster image" hint="Shown at the top of the window page." />
        </div>
      </div>
    </Sheet>
  );
}
