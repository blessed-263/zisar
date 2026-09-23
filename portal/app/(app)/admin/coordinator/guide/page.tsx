"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, Eye, Plus, Trash as Trash2 } from "@phosphor-icons/react";
import { useDemo, withUndo } from "@/lib/store";
import { COORDINATOR_UNIVERSITY } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { PageHeader } from "@/components/blocks";
import { Guard } from "@/components/Guard";

export default function GuideEditorPage() {
  return (
    <Guard area="coordinator">
      <GuideEditor />
    </Guard>
  );
}

function GuideEditor() {
  const data = useDemo((s) => s.data);
  const updateGuide = useDemo((s) => s.updateGuide);
  const uni = data.universities.find((u) => u.id === COORDINATOR_UNIVERSITY)!;
  const guide = data.guides.find((g) => g.universityId === uni.id);
  const [sections, setSections] = React.useState(() => (guide?.sections ?? []).map((s, i) => ({ ...s, key: i })));
  const [error, setError] = React.useState("");
  const dirty = JSON.stringify(sections.map(({ title, body }) => ({ title, body }))) !== JSON.stringify(guide?.sections ?? []);

  function move(i: number, d: -1 | 1) {
    const next = [...sections];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setSections(next);
  }

  return (
    <>
      <PageHeader
        label="Coordinator"
        title={`Guide for ${uni.name}`}
        description={guide ? `Last saved ${formatDateTime(guide.updatedAt)} by ${guide.updatedBy}. Students see it under University guides.` : undefined}
        actions={
          <>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/guides/${uni.id}`}>
                <Eye className="size-4" aria-hidden />
                View as student
              </Link>
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!dirty}
              onClick={() => {
                if (sections.some((s) => !s.title.trim() || !s.body.trim())) return setError("Every section needs a title and some text.");
                setError("");
                withUndo("Guide saved.", () => updateGuide(uni.id, sections.map(({ title, body }) => ({ title: title.trim(), body: body.trim() }))));
              }}
            >
              Save guide
            </Button>
          </>
        }
      />
      {error && <p className="t-small mb-4 text-danger">{error}</p>}
      <div className="flex max-w-3xl flex-col gap-4">
        {sections.map((s, i) => (
          <Card key={s.key}>
            <CardBody className="flex flex-col gap-3">
              <div className="flex items-end gap-2">
                <Field label={`Section ${i + 1} title`} className="flex-1">
                  <Input value={s.title} onChange={(e) => setSections(sections.map((x) => (x.key === s.key ? { ...x, title: e.target.value } : x)))} />
                </Field>
                <Button variant="ghost" size="icon" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                  <ArrowUp className="size-4" aria-hidden />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Move down" disabled={i === sections.length - 1} onClick={() => move(i, 1)}>
                  <ArrowDown className="size-4" aria-hidden />
                </Button>
                <Button variant="ghost" size="icon" aria-label={`Remove ${s.title || "section"}`} onClick={() => setSections(sections.filter((x) => x.key !== s.key))}>
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </div>
              <Field label="Text" hint="Plain language. Short paragraphs. Include room numbers and opening hours.">
                <Textarea rows={5} value={s.body} onChange={(e) => setSections(sections.map((x) => (x.key === s.key ? { ...x, body: e.target.value } : x)))} />
              </Field>
            </CardBody>
          </Card>
        ))}
        <Button variant="secondary" className="self-start" onClick={() => setSections([...sections, { title: "", body: "", key: Date.now() }])}>
          <Plus className="size-4" aria-hidden />
          Add section
        </Button>
      </div>
    </>
  );
}
