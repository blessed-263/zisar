"use client";

import { BookOpen } from "@phosphor-icons/react";
import { useDemo, useCurrentStudent } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { CITIES } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import { PageHeader, Row } from "@/components/blocks";

export default function GuidesPage() {
  const data = useDemo((s) => s.data);
  const role = useDemo((s) => s.role);
  const me = useCurrentStudent();
  const mine = role === "student" ? me.studies.universityId : undefined;
  return (
    <>
      <PageHeader
        title="University guides"
        description="What seniors wish they had known: registration, hostels, the dean’s office, and where to get help. Written by city coordinators."
      />
      <div className="flex flex-col gap-6">
        {CITIES.map((city) => {
          const unis = data.universities.filter((u) => u.city === city);
          if (!unis.length) return null;
          return (
            <section key={city} aria-labelledby={`g-${city}`}>
              <h2 id={`g-${city}`} className="t-label mb-2">
                {city}
              </h2>
              <Card className="overflow-hidden divide-y divide-border">
                {unis.map((u) => {
                  const g = data.guides.find((x) => x.universityId === u.id);
                  return (
                    <Row
                      key={u.id}
                      href={`/guides/${u.id}`}
                      icon={BookOpen}
                      title={u.id === mine ? `${u.name} · your university` : u.name}
                      meta={g ? `${g.sections.length} sections · updated ${formatDate(g.updatedAt)}` : "No guide yet"}
                    />
                  );
                })}
              </Card>
            </section>
          );
        })}
      </div>
    </>
  );
}
