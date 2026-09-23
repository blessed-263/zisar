"use client";

import * as React from "react";
import { Printer } from "@phosphor-icons/react";
import { activeWindowId, buildOversight, emptySemester, type SemesterCounts, type Slice } from "@/lib/analytics";
import { useDemo } from "@/lib/store";
import { formatDate, cn } from "@/lib/utils";
import { Card, CardHeader } from "@/components/ui/card";
import { Select } from "@/components/ui/field";
import { LinkButton, PageHeader } from "@/components/blocks";
import { StatCard } from "@/components/StatCard";

type Dimension = "city" | "university" | "province" | "cohort" | "scholarship";

const DIMENSIONS: { id: Dimension; label: string; hint: string }[] = [
  { id: "city", label: "City", hint: "Where members study in Russia" },
  { id: "university", label: "School", hint: "University by university" },
  { id: "province", label: "Home province", hint: "Zimbabwe province on the file" },
  { id: "cohort", label: "Cohort", hint: "Scholarship year of arrival" },
  { id: "scholarship", label: "Scholarship", hint: "Presidential, National, Other" },
];

export function AnalyticsDashboard({ compact }: { compact?: boolean }) {
  const data = useDemo((s) => s.data);
  const [windowId, setWindowId] = React.useState(() => activeWindowId(data) ?? "");
  const [dimension, setDimension] = React.useState<Dimension>("city");

  const w = data.windows.find((x) => x.id === windowId) ?? data.windows[0];
  const oversight = React.useMemo(() => buildOversight(data, windowId || undefined), [data, windowId]);

  const slices: Slice[] =
    dimension === "city"
      ? oversight.byCity
      : dimension === "university"
        ? oversight.byUniversity
        : dimension === "province"
          ? oversight.byProvince
          : dimension === "cohort"
            ? oversight.byCohort
            : oversight.byScholarship;

  const dimMeta = DIMENSIONS.find((d) => d.id === dimension)!;

  return (
    <>
      <PageHeader
        label="Executive"
        title={compact ? "Statistics" : "Oversight"}
        description={
          compact
            ? w
              ? `${w.name} · deadline ${formatDate(w.deadline)}`
              : "Members, regions, and schools at a glance."
            : "Members, semester progress, and risk across cities, schools, and home provinces."
        }
        actions={
          <>
            <Select
              value={windowId}
              onChange={(e) => setWindowId(e.target.value)}
              aria-label="Semester window"
              className="h-10 w-auto min-w-48"
            >
              {data.windows.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </Select>
            <LinkButton href={`/admin/reports?window=${windowId}`} size="sm">
              <Printer className="size-4" aria-hidden />
              Semester report
            </LinkButton>
            {compact && (
              <LinkButton href="/admin/analytics" size="sm" variant="primary">
                Full oversight
              </LinkButton>
            )}
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Members" value={oversight.members} change={`${oversight.enrolled} enrolled`} />
        <StatCard
          label="Profile complete"
          value={`${oversight.profileAvg}%`}
          tone={oversight.profileAvg >= 80 ? "success" : oversight.profileAvg >= 60 ? "warning" : "danger"}
          change="Average across files"
        />
        <StatCard
          label="Expiring ≤30 days"
          value={oversight.expiring30}
          tone={oversight.expiring30 ? "warning" : "success"}
          change="Visa, registration, or insurance"
        />
        <StatCard
          label="Help open"
          value={oversight.helpOpen}
          tone={oversight.helpOpen ? "info" : "default"}
          change="Welfare office cases"
        />
        <StatCard
          label="Alerts open"
          value={oversight.alertsOpen}
          tone={oversight.alertsOpen ? "danger" : "success"}
          change="Emergency, not yet received"
        />
        <StatCard
          label="Queue waiting"
          value={oversight.queueWaiting}
          tone={oversight.queueWaiting ? "info" : "default"}
          change={`${oversight.docsWaiting} documents · ${oversight.travelOpen} travel`}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="t-label text-accent">Break down by</p>
          <p className="mt-1 text-[14px] text-muted">{dimMeta.hint}</p>
        </div>
        <div role="tablist" aria-label="Breakdown dimension" className="flex flex-wrap gap-1.5">
          {DIMENSIONS.map((d) => (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={dimension === d.id}
              onClick={() => setDimension(d.id)}
              className={cn(
                "rounded-[8px] px-3 py-1.5 text-[13px] font-medium transition-colors",
                dimension === d.id
                  ? "bg-text text-bg"
                  : "bg-surface-muted text-muted hover:bg-border/60 hover:text-text",
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="mt-4 overflow-hidden">
        <CardHeader
          title={`By ${dimMeta.label.toLowerCase()}`}
          description={
            w
              ? `Membership today, plus ${w.name} semester progress.`
              : "Membership and risk by region."
          }
        />
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[720px] text-[14px]">
            <thead>
              <tr className="border-y border-border text-left">
                <th scope="col" className="t-label px-5 py-2.5 font-medium">
                  {dimMeta.label}
                </th>
                <th scope="col" className="t-label px-3 py-2.5 text-right font-medium">
                  Members
                </th>
                <th scope="col" className="t-label px-3 py-2.5 text-right font-medium">
                  Profile
                </th>
                <th scope="col" className="t-label px-3 py-2.5 text-right font-medium">
                  Expiring
                </th>
                <th scope="col" className="t-label px-3 py-2.5 text-right font-medium">
                  Help
                </th>
                <th scope="col" className="t-label px-3 py-2.5 text-right font-medium">
                  Verified
                </th>
                <th scope="col" className="t-label w-[28%] px-5 py-2.5 font-medium">
                  Semester
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {slices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-muted">
                    No members in this view yet.
                  </td>
                </tr>
              ) : (
                slices.map((row) => (
                  <tr key={row.key}>
                    <th scope="row" className="px-5 py-3 text-left font-medium">
                      {row.label}
                      {row.sub ? <span className="t-small block font-normal text-muted">{row.sub}</span> : null}
                    </th>
                    <td className="tabular px-3 py-3 text-right">{row.members}</td>
                    <td className="tabular px-3 py-3 text-right">{row.profileAvg}%</td>
                    <td
                      className={cn(
                        "tabular px-3 py-3 text-right",
                        row.expiring > 0 && "font-semibold text-warning",
                      )}
                    >
                      {row.expiring}
                    </td>
                    <td
                      className={cn(
                        "tabular px-3 py-3 text-right",
                        row.helpOpen + row.alertsOpen > 0 && "font-semibold text-danger",
                      )}
                    >
                      {row.helpOpen + row.alertsOpen}
                    </td>
                    <td className="tabular px-3 py-3 text-right">
                      {row.semester.verified}
                      <span className="text-muted"> / {row.semester.total || "—"}</span>
                    </td>
                    <td className="px-5 py-3">
                      <Bar c={row.semester} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Legend />
      </Card>

      {!compact && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {oversight.byCity.map((c) => (
            <Card key={c.key} className="flex flex-col gap-3 p-4">
              <span className="t-label">{c.label}</span>
              <span className="tabular font-display text-[28px] leading-none font-medium tracking-[-0.03em]">
                {c.members}
                <span className="ml-1 text-[14px] font-normal text-muted">members</span>
              </span>
              <p className="t-small text-muted">
                {c.semester.verified}/{c.semester.total || 0} verified · {c.expiring} expiring ·{" "}
                {c.helpOpen + c.alertsOpen} welfare
              </p>
              <Bar c={c.semester.total ? c.semester : emptySemester()} />
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

function Bar({ c }: { c: SemesterCounts }) {
  const seg = (n: number) => `${c.total ? (n / c.total) * 100 : 0}%`;
  return (
    <div
      className="flex h-2 w-full overflow-hidden rounded-full bg-surface-muted"
      role="img"
      aria-label={`${c.verified} verified, ${c.submitted + c.queried} waiting, ${c.rejected} rejected, ${c.overdue} overdue, out of ${c.total}`}
    >
      <span className="bg-success" style={{ width: seg(c.verified) }} />
      <span className="bg-info" style={{ width: seg(c.submitted) }} />
      <span className="bg-warning" style={{ width: seg(c.queried) }} />
      <span className="bg-danger/70" style={{ width: seg(c.rejected) }} />
      <span className="bg-danger" style={{ width: seg(c.overdue) }} />
    </div>
  );
}

function Legend() {
  const items = [
    ["bg-success", "Verified"],
    ["bg-info", "Submitted"],
    ["bg-warning", "Queried"],
    ["bg-danger/70", "Rejected"],
    ["bg-danger", "Overdue"],
    ["bg-surface-muted border border-border", "Not started"],
  ];
  return (
    <div className="t-small flex flex-wrap gap-x-4 gap-y-1 border-t border-border px-5 py-3 text-muted">
      {items.map(([cls, label]) => (
        <span key={label} className="flex items-center gap-1.5">
          <span className={cn("size-2.5 rounded-full", cls)} aria-hidden />
          {label}
        </span>
      ))}
    </div>
  );
}
