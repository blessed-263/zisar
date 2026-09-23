"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FileText, Tray as Inbox } from "@phosphor-icons/react";
import { useDemo } from "@/lib/store";
import { docLabel, OUTCOME_LABEL } from "@/lib/constants";
import { cityOf, fullName, uniOf } from "@/lib/selectors";
import type { City } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/field";
import { Tabs } from "@/components/ui/tabs";
import { Avatar, PageHeader } from "@/components/blocks";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { Guard } from "@/components/Guard";

export default function QueuePage() {
  return (
    <Guard area="queue">
      <Queue />
    </Guard>
  );
}

const CITIES: City[] = ["Moscow", "Kazan", "Belgorod", "St Petersburg"];

function Queue() {
  const data = useDemo((s) => s.data);
  const params = useSearchParams();
  const router = useRouter();
  const tab = (params.get("tab") as "results" | "documents") ?? "results";
  const [status, setStatus] = React.useState("submitted");
  const [uni, setUni] = React.useState("");
  const [city, setCity] = React.useState("");
  const [cohort, setCohort] = React.useState("");
  const cohorts = [...new Set(data.students.map((s) => s.scholarship.cohort))].sort();

  const matchStudent = (studentId: string) => {
    const s = data.students.find((x) => x.id === studentId);
    if (!s) return false;
    if (uni && s.studies.universityId !== uni) return false;
    if (city && cityOf(data, s) !== city) return false;
    if (cohort && String(s.scholarship.cohort) !== cohort) return false;
    return true;
  };

  const lastAt = (sub: (typeof data.submissions)[number]) => sub.events.at(-1)?.at ?? "";
  const results = data.submissions
    .filter((x) => x.status !== "draft")
    .filter((x) => (status === "all" ? true : x.status === status))
    .filter((x) => matchStudent(x.studentId))
    .sort((a, b) => lastAt(a).localeCompare(lastAt(b)));
  const docs = data.documents
    .filter((d) => (status === "all" ? true : status === "submitted" ? d.status === "received" : d.status === status))
    .filter((d) => matchStudent(d.studentId))
    .sort((a, b) => a.uploadedAt.localeCompare(b.uploadedAt));

  const waitingResults = data.submissions.filter((x) => x.status === "submitted").length;
  const waitingDocs = data.documents.filter((d) => d.status === "received").length;

  return (
    <>
      <PageHeader label="Verifier" title="Queue" description="Oldest first. Open an item to see the file beside the student’s profile." />
      <Tabs
        label="Queue type"
        value={tab}
        onChange={(v) => router.replace(`/admin/queue?tab=${v}`, { scroll: false })}
        items={[
          { value: "results", label: "Semester results", count: waitingResults },
          { value: "documents", label: "Documents", count: waitingDocs },
        ]}
      />
      <div className="my-4 grid grid-cols-2 gap-2 md:grid-cols-4">
        <Select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className="h-10">
          <option value="submitted">Waiting for review</option>
          <option value="queried">Queried</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
          <option value="all">All statuses</option>
        </Select>
        <Select aria-label="University" value={uni} onChange={(e) => setUni(e.target.value)} className="h-10">
          <option value="">All universities</option>
          {data.universities.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </Select>
        <Select aria-label="City" value={city} onChange={(e) => setCity(e.target.value)} className="h-10">
          <option value="">All cities</option>
          {CITIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
        <Select aria-label="Cohort" value={cohort} onChange={(e) => setCohort(e.target.value)} className="h-10">
          <option value="">All cohorts</option>
          {cohorts.map((c) => (
            <option key={c} value={String(c)}>
              Cohort {c}
            </option>
          ))}
        </Select>
      </div>

      {tab === "results" ? (
        results.length === 0 ? (
          <EmptyState icon={Inbox} title="Nothing matches these filters. The queue is clear." />
        ) : (
          <Card className="divide-y divide-border overflow-hidden">
            {results.map((sub) => {
              const s = data.students.find((x) => x.id === sub.studentId)!;
              const w = data.windows.find((x) => x.id === sub.windowId);
              const replied = sub.events.at(-1)?.kind === "replied";
              return (
                <Link key={sub.id} href={`/admin/review/${sub.id}`} className="flex min-h-16 items-center gap-3 px-4 py-3 hover:bg-surface-muted md:px-5">
                  <Avatar name={fullName(s)} photo={s.photo} size={36} />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium">{fullName(s)}</span>
                    <span className="t-small truncate text-muted">
                      {w?.name} · {uniOf(data, s)?.name} · {OUTCOME_LABEL[sub.outcome]}
                    </span>
                  </span>
                  <span className="t-small hidden text-muted md:block">{formatDate(sub.events.at(-1)?.at)}</span>
                  {replied && sub.status === "submitted" && <StatusPill status="submitted" label="Student replied" size="sm" className="hidden sm:inline-flex" />}
                  {sub.appeal?.status === "returned" && sub.status === "submitted" && <StatusPill status="returned" label="Returned on appeal" size="sm" className="hidden sm:inline-flex" />}
                  <StatusPill status={sub.status} size="sm" />
                </Link>
              );
            })}
          </Card>
        )
      ) : docs.length === 0 ? (
        <EmptyState icon={FileText} title="No documents match these filters." />
      ) : (
        <Card className="divide-y divide-border overflow-hidden">
          {docs.map((d) => {
            const s = data.students.find((x) => x.id === d.studentId)!;
            return (
              <Link key={d.id} href={`/admin/documents/${d.id}`} className="flex min-h-16 items-center gap-3 px-4 py-3 hover:bg-surface-muted md:px-5">
                <Avatar name={fullName(s)} photo={s.photo} size={36} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-medium">
                    {fullName(s)} · {docLabel(d.type)}
                  </span>
                  <span className="t-small truncate text-muted">
                    {d.fileName} · uploaded {formatDate(d.uploadedAt)}
                  </span>
                </span>
                <StatusPill status={d.status} size="sm" />
              </Link>
            );
          })}
        </Card>
      )}
    </>
  );
}
