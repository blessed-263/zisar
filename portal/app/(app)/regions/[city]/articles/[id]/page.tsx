"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";
import { useDemo } from "@/lib/store";
import { cityFromSlug, citySlug } from "@/lib/cities";
import { formatDate } from "@/lib/utils";
import { LinkButton } from "@/components/blocks";
import { Guard } from "@/components/Guard";
import { EmptyState } from "@/components/EmptyState";

export default function CityArticlePage() {
  return (
    <Guard area="regions">
      <Article />
    </Guard>
  );
}

function Article() {
  const params = useParams<{ city: string; id: string }>();
  const data = useDemo((s) => s.data);
  const city = cityFromSlug(params.city);
  const article = data.cityArticles.find((a) => a.id === params.id && a.city === city);

  if (!city || !article) {
    return (
      <EmptyState
        icon={ArrowLeft}
        title="Article not found"
        action={
          <LinkButton href="/regions" size="sm">
            Back to cities
          </LinkButton>
        }
      />
    );
  }

  return (
    <article className="mx-auto max-w-2xl">
      <Link
        href={`/regions/${citySlug(city)}`}
        className="t-small mb-6 inline-flex items-center gap-1.5 text-muted hover:text-text"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        {city}
      </Link>
      {article.cover && (
        <img
          src={article.cover}
          alt=""
          className="mb-6 aspect-[16/9] w-full rounded-[16px] object-cover"
        />
      )}
      <p className="t-label text-accent">{city}</p>
      <h1 className="font-display mt-2 text-[32px] leading-tight font-medium tracking-[-0.03em] text-balance">
        {article.title}
      </h1>
      <p className="t-small mt-3 text-muted">
        {formatDate(article.at)} · {article.by}
      </p>
      <div className="mt-8 flex flex-col gap-5 text-[16px] leading-7">
        {article.body.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  );
}
