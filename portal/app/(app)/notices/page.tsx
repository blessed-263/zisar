"use client";

import * as React from "react";
import Link from "next/link";
import { type Icon, Bell, Checks as CheckCheck, Gavel, Handshake as HeartHandshake, Info, Megaphone, CheckSquare as Vote } from "@phosphor-icons/react";
import { useDemo, useCurrentStudent } from "@/lib/store";
import { audienceLabel, audienceMatches } from "@/lib/selectors";
import type { PersonalNotice } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { PageHeader } from "@/components/blocks";
import { PosterCard } from "@/components/PosterCard";
import { EmptyState } from "@/components/EmptyState";

const KIND_ICON: Record<PersonalNotice["kind"], Icon> = {
  decision: Gavel,
  election: Vote,
  welfare: HeartHandshake,
  system: Info,
};

type Tab = "all" | "personal" | "announcements";

export default function NoticesPage() {
  const role = useDemo((s) => s.role);
  return role === "student" ? <StudentNotices /> : <AllAnnouncements />;
}

function StudentNotices() {
  const data = useDemo((s) => s.data);
  const markAllRead = useDemo((s) => s.markAllRead);
  const s = useCurrentStudent();
  const [tab, setTab] = React.useState<Tab>("all");
  const personal = data.notices.filter((n) => n.studentId === s.id);
  const announcements = data.announcements.filter((a) => audienceMatches(data, a, s));
  const unread = personal.filter((n) => !n.read).length + announcements.filter((a) => !a.readBy.includes(s.id)).length;

  const items = [
    ...(tab !== "announcements" ? personal.map((n) => ({ kind: "personal" as const, at: n.at, n })) : []),
    ...(tab !== "personal" ? announcements.map((a) => ({ kind: "announcement" as const, at: a.at, a })) : []),
  ].sort((a, b) => b.at.localeCompare(a.at));

  return (
    <>
      <PageHeader
        title="Notices"
        description="Decisions about your file, and news from the association."
        actions={
          unread > 0 && (
            <Button variant="secondary" size="sm" onClick={() => markAllRead(s.id)}>
              <CheckCheck className="size-4" aria-hidden />
              Mark all read
            </Button>
          )
        }
      />
      <Tabs<Tab>
        label="Notice type"
        value={tab}
        onChange={setTab}
        className="mb-4"
        items={[
          { value: "all", label: "All", count: unread },
          { value: "personal", label: "For you", count: personal.filter((n) => !n.read).length },
          { value: "announcements", label: "Announcements", count: announcements.filter((a) => !a.readBy.includes(s.id)).length },
        ]}
      />
      {items.length === 0 ? (
        <EmptyState icon={Bell} title="No notices yet. Decisions and association news will appear here." />
      ) : (
        <Card className="divide-y divide-border overflow-hidden">
          {items.map((it) => {
            if (it.kind === "personal") {
              const Icon = KIND_ICON[it.n.kind];
              return (
                <Link key={it.n.id} href={`/notices/${it.n.id}`} className="flex items-start gap-3 px-4 py-3.5 hover:bg-surface-muted md:px-5">
                  <span className={cn("mt-0.5 grid size-9 shrink-0 place-items-center rounded-full", it.n.read ? "bg-surface-muted text-muted" : "bg-accent-soft text-accent")}>
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className={cn("truncate", it.n.read ? "font-medium" : "font-semibold")}>{it.n.title}</span>
                    <span className="t-small line-clamp-2 text-muted">{it.n.body}</span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="t-small text-muted">{formatDate(it.n.at)}</span>
                    {!it.n.read && <span className="size-2 rounded-full bg-accent" aria-label="Unread" />}
                  </span>
                </Link>
              );
            }
            const read = it.a.readBy.includes(s.id);
            return (
              <Link key={it.a.id} href={`/notices/${it.a.id}`} className="flex items-start gap-3 px-4 py-3.5 hover:bg-surface-muted md:px-5">
                {it.a.image ? (
                   
                  <img src={it.a.image} alt="" className="mt-0.5 aspect-video w-16 shrink-0 rounded-[6px] object-cover" />
                ) : (
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-surface-muted text-muted">
                    <Megaphone className="size-4" aria-hidden />
                  </span>
                )}
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className={cn("truncate", read ? "font-medium" : "font-semibold")}>{it.a.title}</span>
                  <span className="t-small truncate text-muted">
                    {audienceLabel(data, it.a)} · {it.a.by}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="t-small text-muted">{formatDate(it.a.at)}</span>
                  {!read && <span className="size-2 rounded-full bg-accent" aria-label="Unread" />}
                </span>
              </Link>
            );
          })}
        </Card>
      )}
    </>
  );
}

function AllAnnouncements() {
  const data = useDemo((s) => s.data);
  const role = useDemo((s) => s.role);
  return (
    <>
      <PageHeader
        title="Notices"
        description="Announcements published to students."
        actions={
          role === "executive" && (
            <Button asChild variant="primary" size="sm">
              <Link href="/admin/announcements">New announcement</Link>
            </Button>
          )
        }
      />
      {data.announcements.length === 0 ? (
        <EmptyState icon={Megaphone} title="No announcements yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.announcements.map((a) => (
            <PosterCard key={a.id} title={a.title} date={a.at} image={a.image} alt={a.alt} chip={audienceLabel(data, a)} href={`/notices/${a.id}`} />
          ))}
        </div>
      )}
    </>
  );
}
