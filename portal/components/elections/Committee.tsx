"use client";

import { useDemo } from "@/lib/store";
import { MemberCard } from "@/components/MemberCard";
import { formatDate } from "@/lib/utils";

export function Committee() {
  const data = useDemo((s) => s.data);
  const uni = (id?: string) => data.universities.find((u) => u.id === id);
  const leads = data.committee.filter((c) => c.lead);
  const exec = data.committee.filter((c) => c.group === "executive" && !c.lead);
  const city = data.committee.filter((c) => c.group === "city");
  const updated = [...data.committee].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="leads">
        <h2 id="leads" className="t-label mb-3">
          Leadership
        </h2>
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:max-w-2xl">
          {leads.map((s) => (
            <MemberCard key={s.id} seat={s} university={uni(s.universityId)} large />
          ))}
        </div>
      </section>
      <section aria-labelledby="exec">
        <h2 id="exec" className="t-label mb-3">
          Executive committee
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {exec.map((s) => (
            <MemberCard key={s.id} seat={s} university={uni(s.universityId)} />
          ))}
        </div>
      </section>
      <section aria-labelledby="city">
        <h2 id="city" className="t-label mb-3">
          City representatives
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {city.map((s) => (
            <MemberCard key={s.id} seat={s} university={uni(s.universityId)} />
          ))}
        </div>
      </section>
      {updated && (
        <p className="t-small text-muted">
          Last changed {formatDate(updated.updatedAt)} by {updated.updatedBy}.
        </p>
      )}
    </div>
  );
}
