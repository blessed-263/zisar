"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChatCircle as MessageCircle } from "@phosphor-icons/react";
import { useDemo, useCurrentApplicant, withUndo } from "@/lib/store";
import { cityFromSlug, citySlug } from "@/lib/cities";
import { formatDate } from "@/lib/utils";
import { PageHeader, LinkButton } from "@/components/blocks";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Sheet } from "@/components/ui/sheet";
import { Guard } from "@/components/Guard";
import { MemberCard } from "@/components/MemberCard";
import { EmptyState } from "@/components/EmptyState";

export default function CityRegionPage() {
  return (
    <Guard area="regions">
      <CityRegion />
    </Guard>
  );
}

function CityRegion() {
  const params = useParams<{ city: string }>();
  const city = cityFromSlug(params.city);
  const data = useDemo((s) => s.data);
  const role = useDemo((s) => s.role);
  const applicant = useCurrentApplicant();
  const followCity = useDemo((s) => s.followCity);
  const unfollowCity = useDemo((s) => s.unfollowCity);
  const createEnquiry = useDemo((s) => s.createEnquiry);
  const router = useRouter();
  const [askOpen, setAskOpen] = React.useState(false);

  if (!city) {
    return (
      <EmptyState
        icon={ArrowLeft}
        title="City not found"
        action={
          <LinkButton href="/regions" size="sm">
            Back to cities
          </LinkButton>
        }
      />
    );
  }

  const brief = data.cityBriefs.find((b) => b.city === city);
  const seat = data.committee.find((c) => c.group === "city" && c.city === city);
  const articles = data.cityArticles.filter((a) => a.city === city).sort((a, b) => b.at.localeCompare(a.at));
  const joined = role === "applicant" && !!applicant?.followedCities.includes(city);

  return (
    <>
      <Link href="/regions" className="t-small mb-4 inline-flex items-center gap-1.5 text-muted hover:text-text">
        <ArrowLeft className="size-3.5" aria-hidden />
        All cities
      </Link>
      <PageHeader
        label={city}
        title={city}
        description={brief?.intro}
        actions={
          role === "applicant" && applicant ? (
            <>
              <Button
                size="sm"
                variant={joined ? "secondary" : "primary"}
                onClick={() =>
                  withUndo(joined ? `Left ${city}.` : `Joined ${city}.`, () =>
                    joined ? unfollowCity(applicant.id, city) : followCity(applicant.id, city),
                  )
                }
              >
                {joined ? "Leave city" : "Join city"}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setAskOpen(true)}>
                <MessageCircle className="size-4" aria-hidden />
                Ask the representative
              </Button>
            </>
          ) : undefined
        }
      />

      {seat && (
        <section className="mb-8 max-w-sm" aria-labelledby="rep-heading">
          <h2 id="rep-heading" className="t-label mb-3">
            City representative
          </h2>
          <MemberCard seat={seat} university={data.universities.find((u) => u.id === seat.universityId)} />
        </section>
      )}

      {brief && (
        <section className="mb-10" aria-labelledby="brief-heading">
          <h2 id="brief-heading" className="t-label mb-3">
            The good, the bad, and the ugly
          </h2>
          <p className="t-small mb-4 text-muted">
            Written by {brief.updatedBy} · {formatDate(brief.updatedAt)}. Straight talk for applicants still in
            Zimbabwe.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {(
              [
                ["The good", brief.good, "border-success/30 bg-success/5"],
                ["The bad", brief.bad, "border-warning/30 bg-warning/5"],
                ["The ugly", brief.ugly, "border-danger/30 bg-danger/5"],
              ] as const
            ).map(([title, body, cls]) => (
              <Card key={title} className={`flex flex-col gap-2 border p-5 ${cls}`}>
                <h3 className="font-display text-[18px] font-medium tracking-[-0.02em]">{title}</h3>
                <p className="text-[14px] leading-6 text-text/90">{body}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="news-heading">
        <CardHeader title="City news" description={`Articles and tips about life in ${city}.`} />
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {articles.length === 0 ? (
            <li className="text-muted">No articles yet for this city.</li>
          ) : (
            articles.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/regions/${citySlug(city)}/articles/${a.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[16px] border border-border bg-surface shadow-[var(--shadow-card)] transition-[border-color,transform] hover:-translate-y-0.5 hover:border-accent/30"
                >
                  {a.cover && (
                    <img src={a.cover} alt="" className="aspect-[16/9] w-full object-cover" />
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <span className="t-small text-muted">
                      {formatDate(a.at)} · {a.by}
                    </span>
                    <h3 className="font-display text-[18px] leading-snug font-medium tracking-[-0.02em] group-hover:text-accent">
                      {a.title}
                    </h3>
                    <p className="line-clamp-2 text-[14px] leading-6 text-muted">{a.excerpt}</p>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </section>

      {askOpen && applicant && (
        <AskSheet
          city={city}
          open={askOpen}
          onOpenChange={setAskOpen}
          onSubmit={(subject, text) => {
            const id = createEnquiry(applicant.id, city, subject, text);
            if (!joined) followCity(applicant.id, city);
            setAskOpen(false);
            router.push(`/enquiries/${id}`);
          }}
        />
      )}
    </>
  );
}

function AskSheet({
  city,
  open,
  onOpenChange,
  onSubmit,
}: {
  city: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (subject: string, text: string) => void;
}) {
  const [subject, setSubject] = React.useState("");
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState<string>();
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title={`Ask about ${city}`}>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!subject.trim() || !text.trim()) return setError("Add a subject and your question.");
          onSubmit(subject.trim(), text.trim());
        }}
      >
        <p className="text-[14px] leading-6 text-muted">
          Your message goes to the {city} representative. Join the city so you see their news too.
        </p>
        <Field label="Subject" error={error && !subject.trim() ? error : undefined} required>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Hostel, language, costs…" />
        </Field>
        <Field label="Your question" error={error && !text.trim() ? error : undefined} required>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} />
        </Field>
        <Button type="submit" variant="primary">
          Send to representative
        </Button>
      </form>
    </Sheet>
  );
}
