"use client";

import * as React from "react";
import Link from "next/link";
import { Newspaper, PaperPlaneTilt as Send } from "@phosphor-icons/react";
import { useDemo, withUndo } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { fileToDataUrl } from "@/lib/utils";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { FileDrop, type PickedFile } from "@/components/FileDrop";
import { PageHeader, Row } from "@/components/blocks";
import { EmptyState } from "@/components/EmptyState";
import { Guard } from "@/components/Guard";

const TAGS = ["Association", "Life in Russia", "Academics", "Welfare", "Elections"];

export default function BlogAdminPage() {
  return (
    <Guard area="blog">
      <Composer />
    </Guard>
  );
}

function Composer() {
  const raw = useDemo((s) => s.data.posts ?? []);
  const posts = React.useMemo(() => [...raw].sort((a, b) => b.at.localeCompare(a.at)), [raw]);
  const publish = useDemo((s) => s.publishBlogPost);
  const [title, setTitle] = React.useState("");
  const [excerpt, setExcerpt] = React.useState("");
  const [body, setBody] = React.useState("");
  const [tag, setTag] = React.useState(TAGS[0]);
  const [file, setFile] = React.useState<PickedFile | null>(null);
  const [alt, setAlt] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [busy, setBusy] = React.useState(false);

  async function submit() {
    const err: Record<string, string> = {};
    if (!title.trim()) err.title = "Give the post a clear title.";
    if (excerpt.trim().length < 20) err.excerpt = "Write one or two sentences for the list page.";
    if (body.trim().length < 80) err.body = "Write at least a short article. Separate paragraphs with a blank line.";
    if (file && !alt.trim()) err.alt = "Describe the cover image for screen readers.";
    setErrors(err);
    if (Object.keys(err).length) return;
    setBusy(true);
    const cover = file ? await fileToDataUrl(file.file, 1400) : undefined;
    withUndo("Blog post published on the association blog.", () =>
      publish({
        title: title.trim(),
        excerpt: excerpt.trim(),
        body: body.trim(),
        tag,
        cover,
        alt: cover ? alt.trim() : undefined,
      }),
    );
    setTitle("");
    setExcerpt("");
    setBody("");
    setFile(null);
    setAlt("");
    setBusy(false);
  }

  return (
    <>
      <PageHeader
        label="Executive"
        title="Association blog"
        description="Long-form news from the Secretary General. Short posters and deadline alerts still go under Announcements."
        actions={
          <Button asChild variant="secondary" size="sm">
            <Link href="/blog">View blog</Link>
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader title="New post" description="Published under the Secretary General’s name from the committee card." />
          <CardBody className="flex flex-col gap-4">
            <Field label="Title" error={errors.title} required>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
            </Field>
            <Field label="Short summary" error={errors.excerpt} required hint="Shown on the blog list and on Home.">
              <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} maxLength={220} />
            </Field>
            <Field label="Topic" required>
              <Select value={tag} onChange={(e) => setTag(e.target.value)}>
                {TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Article" error={errors.body} required hint="Separate paragraphs with a blank line.">
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} className="min-h-48" />
            </Field>
            <div className="flex flex-col gap-1.5">
              <span className="text-[14px] font-medium">
                Cover image <span className="font-normal text-muted">(optional)</span>
              </span>
              <FileDrop value={file} onChange={setFile} imageOnly label="Drop a cover photo" hint="Wide photo, about 16:9." />
            </div>
            {file && (
              <Field label="Describe the cover" error={errors.alt} required>
                <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="For example: Snowy campus path at dusk" />
              </Field>
            )}
          </CardBody>
          <CardFooter>
            <Button variant="primary" loading={busy} onClick={submit}>
              <Send className="size-4" aria-hidden />
              Publish post
            </Button>
          </CardFooter>
        </Card>

        <div className="flex flex-col gap-3">
          <h2 className="t-label">Published</h2>
          {posts.length ? (
            <Card className="overflow-hidden divide-y divide-border">
              {posts.map((p) => (
                <Row
                  key={p.id}
                  href={`/blog/${p.id}`}
                  icon={Newspaper}
                  title={p.title}
                  meta={`${p.tag} · ${formatDate(p.at)}`}
                />
              ))}
            </Card>
          ) : (
            <EmptyState icon={Newspaper} title="No posts yet." />
          )}
        </div>
      </div>
    </>
  );
}
