"use client";

import * as React from "react";
import { PencilSimple as Pencil } from "@phosphor-icons/react";
import { useDemo, withUndo } from "@/lib/store";
import type { City, CommitteeSeat } from "@/lib/types";
import { CITIES } from "@/lib/constants";
import { fileToDataUrl, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/field";
import { Sheet } from "@/components/ui/sheet";
import { FileDrop, type PickedFile } from "@/components/FileDrop";
import { MemberCard } from "@/components/MemberCard";
import { PageHeader } from "@/components/blocks";
import { Guard } from "@/components/Guard";

export default function CommitteeEditorPage() {
  return (
    <Guard area="committee-edit">
      <Editor />
    </Guard>
  );
}

function Editor() {
  const data = useDemo((s) => s.data);
  const [editing, setEditing] = React.useState<CommitteeSeat | null>(null);
  const groups: [string, CommitteeSeat[]][] = [
    ["Executive committee", data.committee.filter((c) => c.group === "executive")],
    ["City representatives", data.committee.filter((c) => c.group === "city")],
  ];
  return (
    <>
      <PageHeader
        label="Admin"
        title="Committee cards"
        description="These cards appear on the public elections page. Every change is logged with your name."
      />
      <div className="flex flex-col gap-8">
        {groups.map(([label, seats]) => (
          <section key={label} aria-labelledby={label} className="flex flex-col gap-3">
            <h2 id={label} className="t-label">
              {label}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {seats.map((s) => (
                <MemberCard
                  key={s.id}
                  seat={s}
                  university={data.universities.find((u) => u.id === s.universityId)}
                  action={
                    <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                      <span className="t-small text-muted">
                        {s.updatedBy} · {formatDateTime(s.updatedAt)}
                      </span>
                      <Button size="sm" variant="secondary" onClick={() => setEditing(s)}>
                        <Pencil className="size-4" aria-hidden />
                        Edit
                      </Button>
                    </div>
                  }
                />
              ))}
            </div>
          </section>
        ))}
      </div>
      {editing && <SeatSheet key={editing.id} seat={editing} onClose={() => setEditing(null)} />}
    </>
  );
}

function SeatSheet({ seat, onClose }: { seat: CommitteeSeat; onClose: () => void }) {
  const data = useDemo((s) => s.data);
  const updateSeat = useDemo((s) => s.updateSeat);
  const [f, setF] = React.useState({
    name: seat.name ?? "",
    universityId: seat.universityId ?? "",
    city: seat.city ?? "",
    termStart: seat.termStart ?? "",
    termEnd: seat.termEnd ?? "",
    note: seat.note,
    contact: seat.contact,
  });
  const [vacant, setVacant] = React.useState(!seat.name);
  const [photo, setPhoto] = React.useState<PickedFile | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  async function save() {
    const err: Record<string, string> = {};
    if (!vacant && !f.name.trim()) err.name = "Enter the name, or mark the seat vacant.";
    if (!/^\S+@\S+\.\S+$/.test(f.contact)) err.contact = "Enter an email address, for example president@my-zisar.ru.";
    if (!vacant && f.termStart && f.termEnd && f.termEnd <= f.termStart) err.termEnd = "The term ends after it starts.";
    setErrors(err);
    if (Object.keys(err).length) return;
    const img = photo ? await fileToDataUrl(photo.file, 800) : undefined;
    const patch: Partial<CommitteeSeat> = vacant
      ? { name: undefined, photo: undefined, universityId: undefined, termStart: undefined, termEnd: undefined, note: f.note, contact: f.contact, isSample: false }
      : {
          name: f.name.trim(),
          universityId: f.universityId || undefined,
          city: (f.city || undefined) as City | undefined,
          termStart: f.termStart || undefined,
          termEnd: f.termEnd || undefined,
          note: f.note,
          contact: f.contact,
          isSample: false,
          ...(img ? { photo: img } : {}),
        };
    withUndo(`${seat.office} card updated.`, () => updateSeat(seat.id, patch));
    onClose();
  }

  return (
    <Sheet
      open
      onOpenChange={(o) => !o && onClose()}
      title={seat.office}
      description="Students see this card on the elections page."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={save}>
            Save card
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Checkbox checked={vacant} onChange={setVacant} label="This seat is vacant" />
        {!vacant && (
          <>
            <Field label="Full name" error={errors.name} required>
              <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
            </Field>
            <div className="flex flex-col gap-1.5">
              <span className="text-[14px] font-medium">
                Photo <span className="font-normal text-muted">(optional)</span>
              </span>
              <FileDrop value={photo} onChange={setPhoto} imageOnly label="Drop a portrait photo" hint="Face and shoulders, plain background." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="University" optional>
                <Select
                  value={f.universityId}
                  onChange={(e) => {
                    const u = data.universities.find((x) => x.id === e.target.value);
                    setF({ ...f, universityId: e.target.value, city: u?.city ?? f.city });
                  }}
                >
                  <option value="">Not shown</option>
                  {data.universities.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="City" optional>
                <Select value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })}>
                  <option value="">Not shown</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Term starts" optional>
                <Input type="date" value={f.termStart} onChange={(e) => setF({ ...f, termStart: e.target.value })} />
              </Field>
              <Field label="Term ends" error={errors.termEnd} optional>
                <Input type="date" value={f.termEnd} onChange={(e) => setF({ ...f, termEnd: e.target.value })} />
              </Field>
            </div>
          </>
        )}
        <Field label="What this office does" hint="One or two sentences, shown on the leadership cards.">
          <Textarea value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} />
        </Field>
        <Field label="Contact email" error={errors.contact} required>
          <Input type="email" value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} />
        </Field>
      </div>
    </Sheet>
  );
}
