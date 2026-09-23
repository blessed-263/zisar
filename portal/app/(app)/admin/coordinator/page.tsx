"use client";

import * as React from "react";
import Link from "next/link";
import { MagnifyingGlass as Search } from "@phosphor-icons/react";
import { useDemo } from "@/lib/store";
import { cityOf, expiringItems, fullName, profileCompleteness, stageLabel, uniOf } from "@/lib/selectors";
import { COORDINATOR_CITY } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/field";
import { Segmented } from "@/components/ui/tabs";
import { Avatar, PageHeader } from "@/components/blocks";
import { StatCard } from "@/components/StatCard";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { Guard } from "@/components/Guard";

export default function CoordinatorPage() {
  return (
    <Guard area="coordinator">
      <Coordinator />
    </Guard>
  );
}

function Coordinator() {
  const data = useDemo((s) => s.data);
  const [q, setQ] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "newcomers" | "expiring">("all");
  const students = data.students.filter((s) => cityOf(data, s) === COORDINATOR_CITY);
  const newcomer = (s: (typeof students)[number]) => s.studies.stage === "preparatory" || s.studies.stage === 1;
  const shown = students
    .filter((s) => (filter === "newcomers" ? newcomer(s) : filter === "expiring" ? expiringItems(s, 30).length > 0 : true))
    .filter((s) => !q || fullName(s).toLowerCase().includes(q.toLowerCase()));
  const unpaired = students.filter((s) => newcomer(s) && !data.mentors.some((m) => m.newcomerId === s.id && m.status !== "declined"));

  return (
    <>
      <PageHeader
        label="Coordinator"
        title={`${COORDINATOR_CITY} students`}
        description="Your city only. You see contact and stay details, not passports or results."
      />
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Members in the city" value={students.length} />
        <StatCard label="Newcomers" value={students.filter(newcomer).length} />
        <StatCard label="Documents expiring in 30 days" value={students.filter((s) => expiringItems(s, 30).length).length} tone="warning" />
        <StatCard label="Newcomers without a mentor" value={unpaired.length} href="/admin/coordinator/mentors" />
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <Input aria-label="Search by name" placeholder="Search by name" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <Segmented
          label="Filter"
          value={filter}
          onChange={setFilter}
          items={[
            { value: "all", label: "All" },
            { value: "newcomers", label: "Newcomers" },
            { value: "expiring", label: "Expiring" },
          ]}
        />
      </div>
      {shown.length ? (
        <Card className="overflow-hidden divide-y divide-border">
          {shown.map((s) => {
            const exp = expiringItems(s, 30);
            return (
              <Link key={s.id} href={`/admin/students/${s.id}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-muted/60">
                <Avatar name={fullName(s)} photo={s.photo} size={40} />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="font-medium">{fullName(s)}</span>
                  <span className="t-small truncate text-muted">
                    {uniOf(data, s)?.name} · {stageLabel(s)} · profile {profileCompleteness(s)}% · {s.contacts.phoneRu}
                  </span>
                </div>
                {exp.length > 0 && <StatusPill status="expiring" label={`${exp[0].label} ${formatDate(exp[0].date)}`} size="sm" />}
              </Link>
            );
          })}
        </Card>
      ) : (
        <EmptyState icon={Search} title="No students match." />
      )}
    </>
  );
}
