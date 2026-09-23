"use client";

import Link from "next/link";
import { MapPin, Users } from "@phosphor-icons/react";
import { useDemo, useCurrentApplicant } from "@/lib/store";
import { CITIES } from "@/lib/constants";
import { citySlug } from "@/lib/cities";
import { formatDate } from "@/lib/utils";
import { PageHeader, LinkButton } from "@/components/blocks";
import { Card } from "@/components/ui/card";
import { Guard } from "@/components/Guard";
import { StatusPill } from "@/components/StatusPill";

export default function RegionsPage() {
  return (
    <Guard area="regions">
      <Regions />
    </Guard>
  );
}

function Regions() {
  const data = useDemo((s) => s.data);
  const role = useDemo((s) => s.role);
  const applicant = useCurrentApplicant();
  const followed = role === "applicant" ? applicant?.followedCities ?? [] : [];

  return (
    <>
      <PageHeader
        label={role === "applicant" ? "Before you travel" : "Association"}
        title="Cities in Russia"
        description="Join a city to follow its news, read the representative’s honest brief, and ask questions before you leave Zimbabwe."
      />
      <ul className="grid gap-4 sm:grid-cols-2">
        {CITIES.map((city) => {
          const brief = data.cityBriefs.find((b) => b.city === city);
          const seat = data.committee.find((c) => c.group === "city" && c.city === city);
          const articles = data.cityArticles.filter((a) => a.city === city).length;
          const joined = followed.includes(city);
          return (
            <li key={city}>
              <Card className="flex h-full flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-surface-muted text-accent">
                      <MapPin className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h2 className="font-display text-[22px] font-medium tracking-[-0.02em]">{city}</h2>
                      <p className="t-small text-muted">
                        {seat?.name ? `${seat.name} · representative` : "Representative seat open"}
                      </p>
                    </div>
                  </div>
                  {joined && <StatusPill status="verified" label="Joined" size="sm" />}
                </div>
                <p className="line-clamp-3 text-[14px] leading-6 text-muted">
                  {brief?.intro ?? "City brief coming soon."}
                </p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                  <span className="t-small flex items-center gap-1.5 text-muted">
                    <Users className="size-3.5" aria-hidden />
                    {articles} {articles === 1 ? "article" : "articles"}
                    {brief ? ` · updated ${formatDate(brief.updatedAt)}` : ""}
                  </span>
                  <LinkButton href={`/regions/${citySlug(city)}`} size="sm" variant="primary">
                    Open city
                  </LinkButton>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
      {role === "applicant" && (
        <p className="t-small mt-6 text-muted">
          Your temp account ends {applicant ? formatDate(applicant.expiresAt) : "—"}.{" "}
          <Link href="/enquiries" className="font-medium text-accent hover:underline">
            See your questions to representatives
          </Link>
          .
        </p>
      )}
    </>
  );
}
