"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarBlank as CalendarDays, Check, MapPin } from "@phosphor-icons/react";
import { useDemo, useCurrentStudent, toast } from "@/lib/store";
import { cityOf } from "@/lib/selectors";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/tabs";
import { PageHeader } from "@/components/blocks";
import { PosterCard } from "@/components/PosterCard";
import { EmptyState } from "@/components/EmptyState";

export default function EventsPage() {
  const data = useDemo((s) => s.data);
  const role = useDemo((s) => s.role);
  const toggleGoing = useDemo((s) => s.toggleGoing);
  const me = useCurrentStudent();
  const myCity = cityOf(data, me);
  const [filter, setFilter] = React.useState<"mine" | "all">(role === "student" ? "mine" : "all");
  const now = new Date();
  const events = data.events
    .filter((e) => filter === "all" || e.city === "All cities" || e.city === myCity)
    .sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = events.filter((e) => new Date(e.date) >= now);
  const past = events.filter((e) => new Date(e.date) < now);

  return (
    <>
      <PageHeader
        title="Events"
        description="Meetings, sports days, and welcome evenings."
        actions={
          <>
            {role === "student" && (
              <Segmented
                label="Which events"
                value={filter}
                onChange={setFilter}
                items={[
                  { value: "mine", label: `${myCity} and online` },
                  { value: "all", label: "All cities" },
                ]}
              />
            )}
            {role === "executive" && (
              <Button asChild variant="primary" size="sm">
                <Link href="/admin/events">New event</Link>
              </Button>
            )}
          </>
        }
      />
      {upcoming.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No upcoming events. New ones will appear here and in your notices." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((e) => {
            const going = e.going.includes(me.id);
            return (
              <PosterCard
                key={e.id}
                title={e.title}
                date={e.date}
                image={e.image}
                alt={e.alt}
                chip={e.city}
                footer={
                  <div className="mt-1 flex flex-col gap-3">
                    <p className="t-small line-clamp-3 text-muted">{e.description}</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="t-small flex items-center gap-1 text-muted">
                        <MapPin className="size-3.5" aria-hidden />
                        {e.going.length} coming
                      </span>
                      {role === "student" && (
                        <Button
                          variant={going ? "secondary" : "primary"}
                          size="sm"
                          aria-pressed={going}
                          onClick={() => {
                            toggleGoing(e.id, me.id);
                            toast(going ? "Removed from your list" : `See you on ${formatDate(e.date)}`, { tone: going ? "default" : "success" });
                          }}
                        >
                          {going && <Check className="size-4" aria-hidden />}
                          {going ? "You are coming" : "I am coming"}
                        </Button>
                      )}
                    </div>
                  </div>
                }
              />
            );
          })}
        </div>
      )}
      {past.length > 0 && (
        <section className="mt-10">
          <h2 className="t-label mb-3">Past events</h2>
          <ul className="flex flex-col gap-1 text-muted">
            {past.map((e) => (
              <li key={e.id}>
                {e.title} · {formatDate(e.date)} · {e.city}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
