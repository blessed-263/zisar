"use client";

import * as React from "react";
import Link from "next/link";
import { Warning as AlertTriangle, Calendar as CalendarClock, CaretRight as ChevronRight, Warning as FileWarning, GraduationCap, Handshake as HeartHandshake, Scales as Scale, PencilSimpleLine as UserRoundPen, CheckSquare as Vote } from "@phosphor-icons/react";
import { useDemo, useCurrentStudent, toast } from "@/lib/store";
import {
  audienceMatches,
  expiringItems,
  fullName,
  missingRequiredDocs,
  profileCompleteness,
  profileSections,
  stageLabel,
  submissionFor,
  uniOf,
  windowAppliesTo,
  windowIsOpen,
  windowStateFor,
} from "@/lib/selectors";
import { APPEAL_DAYS } from "@/lib/constants";
import { addDays, daysUntil, formatDate, relativeDays } from "@/lib/utils";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Sheet } from "@/components/ui/sheet";
import { Avatar, LinkButton, Progress, Row } from "@/components/blocks";
import { PosterCard } from "@/components/PosterCard";
import { StatusPill, type PillStatus } from "@/components/StatusPill";

export function StudentHome() {
  const data = useDemo((s) => s.data);
  const s = useCurrentStudent();
  const uni = uniOf(data, s);
  const pct = profileCompleteness(s);

  const openWindow = data.windows.find((w) => windowIsOpen(w) && windowAppliesTo(w, s));
  const openState = openWindow ? windowStateFor(data, openWindow, s) : undefined;
  const openSub = openWindow ? submissionFor(data, openWindow.id, s.id) : undefined;

  const attention: { key: string; icon: typeof AlertTriangle; title: string; meta: string; href: string; tone?: PillStatus }[] = [];
  for (const w of data.windows) {
    const sub = submissionFor(data, w.id, s.id);
    if (sub?.status === "rejected" && !sub.appeal && sub.decidedAt) {
      const due = addDays(APPEAL_DAYS, new Date(sub.decidedAt));
      if (daysUntil(due) >= 0)
        attention.push({
          key: `appeal-${w.id}`,
          icon: Scale,
          title: `${w.name} result rejected`,
          meta: `Submit again or appeal by ${formatDate(due)}`,
          href: `/semesters/${w.id}`,
          tone: "rejected",
        });
    }
  }
  for (const it of expiringItems(s, 60)) {
    attention.push({
      key: it.key,
      icon: CalendarClock,
      title: `${it.label} expires ${formatDate(it.date)}`,
      meta: `${relativeDays(it.date)}. Upload the renewed one when you have it.`,
      href: it.href,
      tone: daysUntil(it.date) < 0 ? "expired" : "expiring",
    });
  }
  const missingSections = profileSections(s, data).filter((x) => x.required && x.state === "missing");
  for (const sec of missingSections) {
    attention.push({
      key: `sec-${sec.id}`,
      icon: UserRoundPen,
      title: `${sec.title}: ${sec.missing.join(", ").toLowerCase()} missing`,
      meta: "Needed before you can vote or be verified",
      href: `/profile?section=${sec.id}`,
    });
  }
  for (const d of missingRequiredDocs(data, s)) {
    attention.push({
      key: `doc-${d.type}`,
      icon: FileWarning,
      title: `${d.label} not uploaded`,
      meta: d.when,
      href: `/documents/${d.type}`,
    });
  }

  const latest = data.announcements.filter((a) => audienceMatches(data, a, s)).sort((a, b) => b.at.localeCompare(a.at))[0];
  const latestPost = [...(data.posts ?? [])].sort((a, b) => b.at.localeCompare(a.at))[0];
  const election = data.elections.find((e) => e.status === "nominations" || e.status === "voting");
  const hasVoted = election?.voted.includes(s.id);
  const mentorAsk = data.mentors.find((m) => m.mentorId === s.id && m.status === "offered");
  const myMentor = data.mentors.find((m) => m.newcomerId === s.id && m.status === "accepted");

  return (
    <div className="flex flex-col gap-6">
      <div className="anim-rise relative overflow-hidden rounded-[18px] border border-border bg-surface shadow-[var(--shadow-card)]">
        <div className="absolute inset-0 opacity-40" aria-hidden>
          <img src="/placeholders/auth-campus.png" alt="" className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/95 to-surface/70" />
        </div>
        <div className="relative flex flex-col gap-1 px-5 py-6 md:px-7 md:py-8">
          <p className="t-label text-accent">{greeting()}</p>
          <h1 className="t-display">{s.preferredName || s.firstNames}</h1>
          <p className="max-w-xl text-muted">
            {uni?.name} · {stageLabel(s)} · {s.scholarship.type} scholarship
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <Card>
          <CardBody className="flex flex-col gap-4 md:py-5">
            <div className="flex items-center gap-4">
              <Avatar name={fullName(s)} photo={s.photo} size={56} />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-semibold">{fullName(s)}</span>
                <span className="t-small truncate text-muted">
                  {uni?.name} · {stageLabel(s)}
                </span>
                <span className="t-small truncate text-muted">
                  {s.scholarship.type} scholarship · Cohort {s.scholarship.cohort}
                </span>
              </div>
              <StatusPill status="enrolled" />
            </div>
            <Link href="/profile" className="flex flex-col gap-2 rounded-[10px] bg-surface-muted/70 p-3 hover:bg-surface-muted">
              <span className="flex items-center justify-between text-[14px]">
                <span className="font-medium">Profile {pct}% complete</span>
                <span className="flex items-center gap-1 text-accent">
                  {pct < 100 ? "Finish it" : "View"} <ChevronRight className="size-4" aria-hidden />
                </span>
              </span>
              <Progress value={pct} label="Profile completeness" />
            </Link>
          </CardBody>
        </Card>

        <Card className="flex flex-col">
          <CardHeader
            label="This semester"
            title={openWindow ? openWindow.name : "No window open"}
            description={
              openWindow
                ? `Due ${formatDate(openWindow.deadline)} · ${relativeDays(openWindow.deadline)}`
                : "You will get a notice when the next window opens."
            }
            action={openState && <StatusPill status={openState} />}
          />
          <CardBody className="mt-auto flex flex-wrap gap-2">
            {openWindow && (
              <>
                {(openState === "not-started" || openState === "draft") && (
                  <LinkButton href={`/semesters/${openWindow.id}`} variant="primary">
                    <GraduationCap className="size-4" aria-hidden />
                    {openState === "draft" ? "Finish and submit" : "Submit results"}
                  </LinkButton>
                )}
                {openState === "queried" && (
                  <LinkButton href={`/semesters/${openWindow.id}`} variant="primary">
                    Reply to the query
                  </LinkButton>
                )}
                {(openState === "submitted" || openState === "verified" || openState === "rejected") && (
                  <LinkButton href={`/semesters/${openWindow.id}`}>View submission</LinkButton>
                )}
                {openSub?.status === "submitted" && (
                  <p className="t-small w-full text-muted">A verifier usually decides within 14 days of the deadline.</p>
                )}
              </>
            )}
            <LinkButton href="/semesters" variant="ghost">
              All semesters
            </LinkButton>
          </CardBody>
        </Card>
      </div>

      {election && (
        <Link
          href="/elections?tab=portal"
          className="anim-rise flex items-center gap-4 rounded-[14px] border border-gold/50 bg-gold-soft/80 px-4 py-3.5 shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-gold-soft"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold text-[#18181b]">
            <Vote className="size-5" aria-hidden />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="flex items-center gap-2 font-semibold">
              <span className="size-2 rounded-full bg-gold" aria-hidden />
              {election.status === "voting" ? (hasVoted ? "You have voted" : "Voting is open") : "Nominations are open"}
            </span>
            <span className="t-small text-muted">
              {election.title} ·{" "}
              {election.status === "voting"
                ? `closes ${formatDate(election.votingCloses)}`
                : `nominations close ${formatDate(election.nominationsClose)}`}
            </span>
          </span>
          <span className="hidden text-[14px] font-medium text-accent sm:block">
            {election.status === "voting" && !hasVoted ? "Vote now" : "Open"}
          </span>
          <ChevronRight className="size-4 text-muted" aria-hidden />
        </Link>
      )}

      {mentorAsk && <MentorAsk id={mentorAsk.id} newcomer={fullName(data.students.find((x) => x.id === mentorAsk.newcomerId))} by={mentorAsk.offeredBy} />}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section aria-labelledby="attention" className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 id="attention" className="t-label">
              Needs attention
            </h2>
            {attention.length > 3 && (
              <Link href="/profile" className="t-small text-accent hover:underline">
                {attention.length - 3} more
              </Link>
            )}
          </div>
          {attention.length === 0 ? (
            <Card>
              <CardBody className="text-muted">Nothing needs your attention. Your file is up to date.</CardBody>
            </Card>
          ) : (
            <Card className="divide-y divide-border overflow-hidden">
              {attention.slice(0, 3).map((a) => (
                <Row
                  key={a.key}
                  href={a.href}
                  icon={a.icon}
                  title={a.title}
                  meta={a.meta}
                  trailing={a.tone ? <StatusPill status={a.tone} size="sm" className="hidden sm:inline-flex" /> : undefined}
                />
              ))}
            </Card>
          )}
          {myMentor && (
            <Card>
              <Row
                icon={HeartHandshake}
                title={`Your mentor: ${fullName(data.students.find((x) => x.id === myMentor.mentorId))}`}
                meta={myMentor.contact}
              />
            </Card>
          )}
        </section>

        <section aria-labelledby="latest" className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 id="latest" className="t-label">
              Latest notice
            </h2>
            <Link href="/notices" className="t-small text-accent hover:underline">
              All notices
            </Link>
          </div>
          {latest ? (
            <PosterCard
              title={latest.title}
              date={latest.at}
              image={latest.image}
              alt={latest.alt}
              href={`/notices/${latest.id}`}
              unread={!latest.readBy.includes(s.id)}
            />
          ) : (
            <Card>
              <CardBody className="text-muted">No notices yet.</CardBody>
            </Card>
          )}
          {latestPost && (
            <Link
              href={`/blog/${latestPost.id}`}
              className="group flex gap-3 overflow-hidden rounded-[14px] border border-border bg-surface shadow-[var(--shadow-card)] transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/30"
            >
              {latestPost.cover && (
                <img src={latestPost.cover} alt="" className="h-24 w-28 shrink-0 object-cover sm:h-28 sm:w-36" />
              )}
              <span className="flex min-w-0 flex-1 flex-col justify-center gap-1 py-3 pr-3">
                <span className="t-label">From the Secretary General</span>
                <span className="line-clamp-2 font-display text-[16px] leading-5 font-medium tracking-[-0.02em]">{latestPost.title}</span>
                <span className="t-small text-muted">{formatDate(latestPost.at)}</span>
              </span>
            </Link>
          )}
        </section>
      </div>
    </div>
  );
}

function MentorAsk({ id, newcomer, by }: { id: string; newcomer: string; by: string }) {
  const respondMentor = useDemo((s) => s.respondMentor);
  const [open, setOpen] = React.useState(false);
  const [contact, setContact] = React.useState("");
  const [error, setError] = React.useState<string>();
  return (
    <Card className="border-accent/30 bg-accent-soft/60">
      <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <HeartHandshake className="size-6 shrink-0 text-accent" aria-hidden />
        <div className="flex flex-1 flex-col">
          <p className="font-semibold">Would you mentor {newcomer}?</p>
          <p className="t-small text-muted">
            {by} asked. You would be the first person they can call in their first semester.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              respondMentor(id, false);
              toast("You declined. The coordinator will ask someone else.");
            }}
          >
            Not this time
          </Button>
          <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
            Yes, I will
          </Button>
        </div>
      </CardBody>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="Share how to reach you"
        description={`Only ${newcomer} and the coordinator will see this.`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!contact.trim()) return setError("Enter a phone number or a Telegram name.");
                respondMentor(id, true, contact.trim());
                setOpen(false);
                toast(`${newcomer} can now reach you`, { tone: "success" });
              }}
            >
              Accept and share
            </Button>
          </>
        }
      >
        <Field label="Phone or Telegram" error={error} hint="For example @tendai_m or +7 916 123 4567">
          <Input value={contact} onChange={(e) => setContact(e.target.value)} />
        </Field>
      </Sheet>
    </Card>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
