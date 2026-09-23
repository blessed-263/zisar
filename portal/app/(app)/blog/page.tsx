"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Newspaper } from "@phosphor-icons/react";
import { useDemo } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { Avatar, PageHeader } from "@/components/blocks";
import { EmptyState } from "@/components/EmptyState";
import { Segmented } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function BlogPage() {
  const raw = useDemo((s) => s.data.posts ?? []);
  const role = useDemo((s) => s.role);
  const posts = React.useMemo(() => [...raw].sort((a, b) => b.at.localeCompare(a.at)), [raw]);
  const tags = React.useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.tag)))], [posts]);
  const [tag, setTag] = React.useState("All");
  const shown = tag === "All" ? posts : posts.filter((p) => p.tag === tag);
  const featured = shown[0];
  const rest = shown.slice(1);

  return (
    <>
      <PageHeader
        label="From the Secretary General"
        title="Blog"
        description="News, explanations, and notes from the association. Short announcements still live under Notices."
        actions={
          role === "executive" ? (
            <Button asChild variant="primary" size="sm">
              <Link href="/admin/blog">Write a post</Link>
            </Button>
          ) : undefined
        }
      />

      {tags.length > 1 && (
        <Segmented
          label="Topics"
          value={tag}
          onChange={setTag}
          className="mb-6"
          items={tags.map((t) => ({ value: t, label: t }))}
        />
      )}

      {shown.length === 0 ? (
        <EmptyState icon={Newspaper} title="No posts yet. The Secretary General will publish here." />
      ) : (
        <div className="flex flex-col gap-8">
          {featured && (
            <Link
              href={`/blog/${featured.id}`}
              className="group anim-rise grid overflow-hidden rounded-[18px] border border-border bg-surface shadow-[var(--shadow-card)] transition-[box-shadow,transform] duration-250 hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)] lg:grid-cols-[1.15fr_1fr]"
            >
              <div className="photo-frame relative aspect-[16/10] lg:aspect-auto lg:min-h-[320px]">
                {featured.cover ? (
                  <img
                    src={featured.cover}
                    alt={featured.alt ?? ""}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="grid size-full place-items-center bg-accent-soft text-accent">
                    <Newspaper className="size-10" aria-hidden />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center gap-4 p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[12px] font-medium text-accent">{featured.tag}</span>
                  <span className="t-small text-muted">{formatDate(featured.at)}</span>
                </div>
                <h2 className="font-display text-[26px] leading-8 font-medium tracking-[-0.03em] md:text-[30px] md:leading-9">
                  {featured.title}
                </h2>
                <p className="text-[15px] leading-6 text-muted">{featured.excerpt}</p>
                <div className="mt-1 flex items-center gap-3">
                  <Avatar name={featured.authorName} photo={featured.authorPhoto} size={36} />
                  <div className="flex flex-col leading-tight">
                    <span className="text-[14px] font-medium">{featured.authorName}</span>
                    <span className="t-small text-muted">{featured.authorTitle}</span>
                  </div>
                  <span className="ml-auto flex items-center gap-1 text-[14px] font-medium text-accent">
                    Read <ArrowRight className="size-4" aria-hidden />
                  </span>
                </div>
              </div>
            </Link>
          )}

          {rest.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.id}`}
                  className="group anim-rise flex flex-col overflow-hidden rounded-[14px] border border-border bg-surface shadow-[var(--shadow-card)] transition-[box-shadow,transform] duration-250 hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)]"
                  style={{ animationDelay: `${Math.min(i, 4) * 40}ms` }}
                >
                  <div className="photo-frame relative aspect-[16/10] bg-accent-soft">
                    {p.cover ? (
                      <img src={p.cover} alt={p.alt ?? ""} className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                    ) : (
                      <div className="grid size-full place-items-center text-accent">
                        <Newspaper className="size-8" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-muted">{p.tag}</span>
                      <span className="t-small text-muted">{formatDate(p.at)}</span>
                    </div>
                    <h3 className="font-display text-[18px] leading-6 font-medium tracking-[-0.02em]">{p.title}</h3>
                    <p className="t-small line-clamp-3 flex-1 text-muted">{p.excerpt}</p>
                    <span className="t-small mt-1 font-medium text-accent">Read post</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
