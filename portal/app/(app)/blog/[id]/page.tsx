"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Newspaper } from "@phosphor-icons/react";
import { useDemo } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { Avatar } from "@/components/blocks";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const posts = useDemo((s) => s.data.posts ?? []);
  const post = posts.find((p) => p.id === id);
  if (!post) return <EmptyState icon={Newspaper} title="This post was not found." />;

  const paragraphs = post.body.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  const related = posts.filter((p) => p.id !== post.id && p.tag === post.tag).slice(0, 2);

  return (
    <article className="anim-rise mx-auto max-w-[720px]">
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/blog">
          <ArrowLeft className="size-4" aria-hidden />
          All posts
        </Link>
      </Button>

      <header className="mb-8 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[12px] font-medium text-accent">{post.tag}</span>
          <span className="t-small text-muted">{formatDate(post.at)}</span>
        </div>
        <h1 className="font-display text-[30px] leading-9 font-medium tracking-[-0.03em] md:text-[38px] md:leading-[1.15]">
          {post.title}
        </h1>
        <p className="text-[17px] leading-7 text-muted">{post.excerpt}</p>
        <div className="flex items-center gap-3 border-y border-border py-4">
          <Avatar name={post.authorName} photo={post.authorPhoto} size={44} />
          <div className="flex flex-col leading-tight">
            <span className="font-medium">{post.authorName}</span>
            <span className="t-small text-muted">{post.authorTitle}</span>
          </div>
          {post.isSample && (
            <span className="t-small ml-auto rounded-full bg-surface-muted px-2.5 py-0.5 text-muted">Sample author</span>
          )}
        </div>
      </header>

      {post.cover && (
        <figure className="mb-8 overflow-hidden rounded-[16px] border border-border shadow-[var(--shadow-card)]">
          <img src={post.cover} alt={post.alt ?? ""} className="aspect-[16/9] w-full object-cover" />
          {post.alt && <figcaption className="t-small px-4 py-2.5 text-muted">{post.alt}</figcaption>}
        </figure>
      )}

      <div className="flex flex-col gap-5 text-[17px] leading-8">
        {paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <footer className="mt-12 border-t border-border pt-8">
        <p className="t-small text-muted">
          Published by the {post.authorTitle} for members of the Zimbabwe Students Association in Russia.
        </p>
        {related.length > 0 && (
          <div className="mt-8">
            <h2 className="t-label mb-3">More in {post.tag}</h2>
            <ul className="flex flex-col gap-3">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={`/blog/${r.id}`} className="group flex gap-3 rounded-[12px] border border-border p-3 hover:border-accent/30">
                    {r.cover && <img src={r.cover} alt="" className="size-16 shrink-0 rounded-[8px] object-cover" />}
                    <span className="flex min-w-0 flex-col">
                      <span className="font-medium group-hover:text-accent">{r.title}</span>
                      <span className="t-small text-muted">{formatDate(r.at)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </footer>
    </article>
  );
}
