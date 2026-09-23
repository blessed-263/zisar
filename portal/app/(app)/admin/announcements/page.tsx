"use client";

import * as React from "react";
import { Megaphone, PaperPlaneTilt as Send } from "@phosphor-icons/react";
import { useDemo, withUndo } from "@/lib/store";
import { audienceLabel, audienceMatches } from "@/lib/selectors";
import type { Announcement, AudienceKind } from "@/lib/types";
import { fileToDataUrl, formatDate } from "@/lib/utils";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { FileDrop, type PickedFile } from "@/components/FileDrop";
import { PageHeader, Row } from "@/components/blocks";
import { PosterCard } from "@/components/PosterCard";
import { EmptyState } from "@/components/EmptyState";
import { Guard } from "@/components/Guard";

export default function AnnouncementsAdminPage() {
  return (
    <Guard area="announcements">
      <Composer />
    </Guard>
  );
}

const CITIES = ["Moscow", "Kazan", "Belgorod", "St Petersburg"];

function Composer() {
  const data = useDemo((s) => s.data);
  const publish = useDemo((s) => s.publishAnnouncement);
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [file, setFile] = React.useState<PickedFile | null>(null);
  const [alt, setAlt] = React.useState("");
  const [kind, setKind] = React.useState<AudienceKind>("all");
  const [value, setValue] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [busy, setBusy] = React.useState(false);
  const cohorts = [...new Set(data.students.map((s) => String(s.scholarship.cohort)))].sort();

  const audience: Announcement["audience"] = { kind, value: kind === "city" || kind === "university" || kind === "cohort" ? value : undefined };
  const reach = data.students.filter((s) => audienceMatches(data, { audience } as Announcement, s)).length;

  async function submit() {
    const err: Record<string, string> = {};
    if (!title.trim()) err.title = "Give the announcement a short title.";
    if (!body.trim()) err.body = "Write the message. Say what, when, and what students should do.";
    if (file && !alt.trim()) err.alt = "Describe the poster for students who use a screen reader. It cannot be published without this.";
    if ((kind === "city" || kind === "university" || kind === "cohort") && !value) err.value = "Choose who receives it.";
    setErrors(err);
    if (Object.keys(err).length) return;
    setBusy(true);
    const image = file ? await fileToDataUrl(file.file, 1280) : undefined;
    withUndo(`Published to ${reach} ${reach === 1 ? "student" : "students"}`, () =>
      publish({ title: title.trim(), body: body.trim(), image, alt: image ? alt.trim() : undefined, audience }),
    );
    setTitle("");
    setBody("");
    setFile(null);
    setAlt("");
    setBusy(false);
  }

  return (
    <>
      <PageHeader label="Executive" title="Announcements" description="Posters and news for students. Decisions about individual files are sent automatically and are not written here." />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader title="New announcement" />
          <CardBody className="flex flex-col gap-4">
            <Field label="Title" error={errors.title} required>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} />
            </Field>
            <Field label="Message" error={errors.body} required>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} className="min-h-32" />
            </Field>
            <div className="flex flex-col gap-1.5">
              <span className="text-[14px] font-medium">
                Poster <span className="font-normal text-muted">(optional)</span>
              </span>
              <FileDrop value={file} onChange={setFile} imageOnly label="Drop a poster image" hint="Shown at 16:9. JPG or PNG." />
            </div>
            {file && (
              <Field label="Poster description" error={errors.alt} required hint="What the poster shows and says, in one sentence.">
                <Input value={alt} onChange={(e) => setAlt(e.target.value)} />
              </Field>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Audience" required>
                <Select
                  value={kind}
                  onChange={(e) => {
                    setKind(e.target.value as AudienceKind);
                    setValue("");
                  }}
                >
                  <option value="all">All students</option>
                  <option value="city">One city</option>
                  <option value="university">One university</option>
                  <option value="cohort">One cohort</option>
                  <option value="overdue">Students with overdue results</option>
                  <option value="expiring">Students with expiring documents</option>
                </Select>
              </Field>
              {(kind === "city" || kind === "university" || kind === "cohort") && (
                <Field label={kind === "city" ? "City" : kind === "university" ? "University" : "Cohort"} error={errors.value} required>
                  <Select value={value} onChange={(e) => setValue(e.target.value)}>
                    <option value="">Choose</option>
                    {kind === "city" && CITIES.map((c) => <option key={c}>{c}</option>)}
                    {kind === "university" &&
                      data.universities.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    {kind === "cohort" &&
                      cohorts.map((c) => (
                        <option key={c} value={c}>
                          Cohort {c}
                        </option>
                      ))}
                  </Select>
                </Field>
              )}
            </div>
          </CardBody>
          <CardFooter>
            <Button variant="primary" onClick={submit} loading={busy}>
              <Send className="size-4" aria-hidden />
              Publish to {reach} {reach === 1 ? "student" : "students"}
            </Button>
          </CardFooter>
        </Card>

        <div className="flex flex-col gap-3">
          <h2 className="t-label">Preview</h2>
          <PosterCard
            title={title || "Your title"}
            date={new Date().toISOString()}
            image={file?.preview}
            alt={alt}
            chip={audienceLabel(data, { audience })}
            footer={<p className="t-small mt-1 line-clamp-3 text-muted">{body || "The message appears here."}</p>}
          />
        </div>
      </div>

      <section className="mt-10" aria-labelledby="published">
        <h2 id="published" className="t-label mb-3">
          Published
        </h2>
        {data.announcements.length === 0 ? (
          <EmptyState icon={Megaphone} title="Nothing published yet." />
        ) : (
          <Card className="divide-y divide-border overflow-hidden">
            {data.announcements.map((a) => {
              const total = data.students.filter((s) => audienceMatches(data, a, s)).length;
              return (
                <Row
                  key={a.id}
                  href={`/notices/${a.id}`}
                  icon={Megaphone}
                  title={a.title}
                  meta={`${formatDate(a.at)} · ${audienceLabel(data, a)} · ${a.by}`}
                  trailing={<span className="tabular t-small shrink-0 text-muted">{a.readBy.length} of {total} read</span>}
                />
              );
            })}
          </Card>
        )}
      </section>
    </>
  );
}
