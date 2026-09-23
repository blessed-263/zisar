"use client";

import * as React from "react";
import { CalendarBlank as CalendarDays, CalendarPlus } from "@phosphor-icons/react";
import { useDemo, withUndo } from "@/lib/store";
import type { ZisarEvent } from "@/lib/types";
import { fileToDataUrl, formatDate } from "@/lib/utils";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { FileDrop, type PickedFile } from "@/components/FileDrop";
import { PageHeader, Row } from "@/components/blocks";
import { EmptyState } from "@/components/EmptyState";
import { Guard } from "@/components/Guard";

export default function EventsAdminPage() {
  return (
    <Guard area="events-admin">
      <EventsAdmin />
    </Guard>
  );
}

function EventsAdmin() {
  const data = useDemo((s) => s.data);
  const publishEvent = useDemo((s) => s.publishEvent);
  const [f, setF] = React.useState({ title: "", date: "", city: "All cities" as ZisarEvent["city"], description: "" });
  const [file, setFile] = React.useState<PickedFile | null>(null);
  const [alt, setAlt] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  async function submit() {
    const err: Record<string, string> = {};
    if (!f.title.trim()) err.title = "Name the event.";
    if (!f.date) err.date = "Choose the date.";
    else if (new Date(f.date) < new Date(new Date().toDateString())) err.date = "The date is in the past.";
    if (!f.description.trim()) err.description = "Say where it is, what happens, and what to bring.";
    if (file && !alt.trim()) err.alt = "Describe the poster. It cannot be published without this.";
    setErrors(err);
    if (Object.keys(err).length) return;
    const image = file ? await fileToDataUrl(file.file, 1280) : undefined;
    withUndo("Event published", () => publishEvent({ ...f, date: new Date(f.date + "T15:00:00").toISOString(), image, alt: image ? alt : undefined }));
    setF({ title: "", date: "", city: "All cities", description: "" });
    setFile(null);
    setAlt("");
  }

  return (
    <>
      <PageHeader label="Executive" title="Events" description="Students see events for their city and online ones, and can say they are coming." />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader title="New event" />
          <CardBody className="flex flex-col gap-4">
            <Field label="Title" error={errors.title} required>
              <Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date" error={errors.date} required>
                <Input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
              </Field>
              <Field label="City" required>
                <Select value={f.city} onChange={(e) => setF({ ...f, city: e.target.value as ZisarEvent["city"] })}>
                  {["All cities", "Moscow", "Kazan", "Belgorod", "St Petersburg"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Description" error={errors.description} required>
              <Textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
            </Field>
            <div className="flex flex-col gap-1.5">
              <span className="text-[14px] font-medium">
                Poster <span className="font-normal text-muted">(optional)</span>
              </span>
              <FileDrop value={file} onChange={setFile} imageOnly label="Drop a poster image" hint="Shown at 16:9." />
            </div>
            {file && (
              <Field label="Poster description" error={errors.alt} required>
                <Input value={alt} onChange={(e) => setAlt(e.target.value)} />
              </Field>
            )}
          </CardBody>
          <CardFooter>
            <Button variant="primary" onClick={submit}>
              <CalendarPlus className="size-4" aria-hidden />
              Publish event
            </Button>
          </CardFooter>
        </Card>
        <section aria-labelledby="upcoming">
          <h2 id="upcoming" className="t-label mb-3">
            All events
          </h2>
          {data.events.length === 0 ? (
            <EmptyState icon={CalendarDays} title="No events yet." />
          ) : (
            <Card className="divide-y divide-border overflow-hidden">
              {[...data.events]
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((e) => (
                  <Row key={e.id} icon={CalendarDays} title={e.title} meta={`${formatDate(e.date)} · ${e.city}`} trailing={<span className="tabular t-small text-muted">{e.going.length} coming</span>} />
                ))}
            </Card>
          )}
        </section>
      </div>
    </>
  );
}
