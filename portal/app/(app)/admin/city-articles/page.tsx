"use client";

import * as React from "react";
import { useDemo, withUndo } from "@/lib/store";
import { REP_CITY } from "@/lib/constants";
import { citySlug } from "@/lib/cities";
import { formatDate } from "@/lib/utils";
import { PageHeader, LinkButton } from "@/components/blocks";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Card, CardHeader } from "@/components/ui/card";
import { Guard } from "@/components/Guard";

export default function CityArticlesAdminPage() {
  return (
    <Guard area="city-brief-edit">
      <ArticlesAdmin />
    </Guard>
  );
}

function ArticlesAdmin() {
  const data = useDemo((s) => s.data);
  const publishCityArticle = useDemo((s) => s.publishCityArticle);
  const mine = data.cityArticles.filter((a) => a.city === REP_CITY).sort((a, b) => b.at.localeCompare(a.at));
  const [title, setTitle] = React.useState("");
  const [excerpt, setExcerpt] = React.useState("");
  const [body, setBody] = React.useState("");

  return (
    <>
      <PageHeader
        label={REP_CITY}
        title="City news"
        description="Articles applicants see when they join your city. Keep them practical."
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="flex flex-col gap-4 p-5">
          <CardHeader title="Publish an article" />
          <Field label="Title" required>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Short summary" required>
            <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} />
          </Field>
          <Field label="Body" required hint="Separate paragraphs with a blank line.">
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} />
          </Field>
          <Button
            variant="primary"
            disabled={!title.trim() || !excerpt.trim() || !body.trim()}
            onClick={() => {
              withUndo("Article published.", () =>
                publishCityArticle({
                  city: REP_CITY,
                  title: title.trim(),
                  excerpt: excerpt.trim(),
                  body: body.trim(),
                  cover: "/placeholders/blog-community.png",
                }),
              );
              setTitle("");
              setExcerpt("");
              setBody("");
            }}
          >
            Publish
          </Button>
        </Card>
        <div className="flex flex-col gap-3">
          <h2 className="t-label">Published</h2>
          <ul className="flex flex-col gap-3">
            {mine.map((a) => (
              <li key={a.id} className="rounded-[12px] border border-border p-4">
                <p className="t-small text-muted">{formatDate(a.at)}</p>
                <p className="font-medium">{a.title}</p>
                <LinkButton href={`/regions/${citySlug(REP_CITY)}/articles/${a.id}`} size="sm" className="mt-2">
                  View
                </LinkButton>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
