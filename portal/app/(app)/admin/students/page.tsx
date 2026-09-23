"use client";

import * as React from "react";
import Link from "next/link";
import { MagnifyingGlass as Search, Users } from "@phosphor-icons/react";
import { useDemo } from "@/lib/store";
import { COORDINATOR_CITY } from "@/lib/constants";
import { cityOf, expiringItems, fullName, profileCompleteness, stageLabel, uniOf } from "@/lib/selectors";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/field";
import { Avatar, PageHeader } from "@/components/blocks";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { Guard } from "@/components/Guard";

export default function StudentsPage() {
  return (
    <Guard area="students">
      <Students />
    </Guard>
  );
}

function Students() {
  const data = useDemo((s) => s.data);
  const role = useDemo((s) => s.role);
  const [q, setQ] = React.useState("");
  const [uni, setUni] = React.useState("");
  const scoped = role === "coordinator" ? data.students.filter((s) => cityOf(data, s) === COORDINATOR_CITY) : data.students;
  const list = scoped
    .filter((s) => !uni || s.studies.universityId === uni)
    .filter((s) => {
      const t = q.trim().toLowerCase();
      if (!t) return true;
      return [fullName(s), s.surname, s.passport.number, s.contacts.email, s.studies.studentNumber].some((x) => x.toLowerCase().includes(t));
    })
    .sort((a, b) => a.surname.localeCompare(b.surname));

  return (
    <>
      <PageHeader
        label="Admin"
        title="Students"
        description={role === "coordinator" ? `Students in ${COORDINATOR_CITY}. Medical notes and help requests are not shown to coordinators.` : "Every member with a portal profile."}
      />
      <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_260px]">
        <label className="relative">
          <span className="sr-only">Search students</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, passport, email, or student number" className="h-10 pl-9" />
        </label>
        <Select aria-label="University" value={uni} onChange={(e) => setUni(e.target.value)} className="h-10">
          <option value="">All universities</option>
          {data.universities
            .filter((u) => role !== "coordinator" || u.city === COORDINATOR_CITY)
            .map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
        </Select>
      </div>
      {list.length === 0 ? (
        <EmptyState icon={Users} title="No student matches that search." />
      ) : (
        <Card className="divide-y divide-border overflow-hidden">
          {list.map((s) => {
            const pct = profileCompleteness(s);
            const exp = expiringItems(s, 30);
            return (
              <Link key={s.id} href={`/admin/students/${s.id}`} className="flex min-h-16 items-center gap-3 px-4 py-3 hover:bg-surface-muted md:px-5">
                <Avatar name={fullName(s)} photo={s.photo} size={36} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-medium">{fullName(s)}</span>
                  <span className="t-small truncate text-muted">
                    {uniOf(data, s)?.name} · {stageLabel(s)} · Cohort {s.scholarship.cohort}
                  </span>
                </span>
                <span className="tabular t-small hidden w-24 text-right text-muted sm:block">{pct}% profile</span>
                {exp.length > 0 && <StatusPill status={exp.some((e) => new Date(e.date) < new Date()) ? "expired" : "expiring"} label={`${exp[0].label}`} size="sm" className="hidden md:inline-flex" />}
                {s.graduation?.status === "sent" && <StatusPill status="sent" label="Graduation to confirm" size="sm" />}
              </Link>
            );
          })}
        </Card>
      )}
    </>
  );
}
