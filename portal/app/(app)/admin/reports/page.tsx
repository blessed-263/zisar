"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Printer } from "@phosphor-icons/react";
import { useDemo } from "@/lib/store";
import { OUTCOME_LABEL, DOC_TYPES } from "@/lib/constants";
import { cityOf, currentDocs, fullName, submissionFor, uniOf, windowAppliesTo, windowStateFor } from "@/lib/selectors";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { PageHeader } from "@/components/blocks";
import { StatusPill } from "@/components/StatusPill";
import { Logo } from "@/components/Logo";
import { Guard } from "@/components/Guard";

export default function ReportsPage() {
  return (
    <Guard area="reports">
      <Report />
    </Guard>
  );
}

function Report() {
  const data = useDemo((s) => s.data);
  const params = useSearchParams();
  const [windowId, setWindowId] = React.useState(params.get("window") ?? data.windows[0]?.id);
  const w = data.windows.find((x) => x.id === windowId) ?? data.windows[0];
  const rows = data.students
    .filter((s) => windowAppliesTo(w, s))
    .map((s) => {
      const docs = currentDocs(data, s.id);
      const missing = DOC_TYPES.filter((d) => d.required && !docs.has(d.type)).filter((d) => !(s.studies.stage === "preparatory" && (d.type === "green-card" || d.type === "student-card")));
      return { s, state: windowStateFor(data, w, s), sub: submissionFor(data, w.id, s.id), missing };
    })
    .sort((a, b) => (uniOf(data, a.s)?.name ?? "").localeCompare(uniOf(data, b.s)?.name ?? "") || a.s.surname.localeCompare(b.s.surname));
  const count = (k: string) => rows.filter((r) => r.state === k).length;

  return (
    <>
      <div data-print="hide">
        <PageHeader
          label="Executive"
          title="Semester report"
          description="For the scholarship department. No passport images, no medical notes, no help requests."
          actions={
            <>
              <Select value={windowId} onChange={(e) => setWindowId(e.target.value)} aria-label="Semester window" className="h-10 w-auto min-w-48">
                {data.windows.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </Select>
              <Button variant="primary" size="sm" onClick={() => window.print()}>
                <Printer className="size-4" aria-hidden />
                Print or save as PDF
              </Button>
            </>
          }
        />
      </div>
      <article data-print="page" className="rounded-[12px] border border-border bg-surface p-6 text-[13px] md:p-8 print:border-0 print:p-0">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <Logo size="md" subtitle="Semester report" />
          <div className="text-right">
            <p className="font-semibold">{w.name}</p>
            <p className="t-small text-muted">
              Deadline {formatDate(w.deadline)} · produced {formatDate(new Date().toISOString())}
            </p>
          </div>
        </header>
        <dl className="tabular mb-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {[
            ["Expected", rows.length],
            ["Verified", count("verified")],
            ["Submitted", count("submitted")],
            ["Queried", count("queried")],
            ["Rejected", count("rejected")],
            ["Overdue", count("overdue")],
          ].map(([k, v]) => (
            <div key={k as string} className="rounded-[8px] border border-border px-3 py-2">
              <dt className="t-small text-muted">{k}</dt>
              <dd className="text-[20px] font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-y border-border text-left">
                <th scope="col" className="py-2 pr-3 font-semibold">Student</th>
                <th scope="col" className="py-2 pr-3 font-semibold">University</th>
                <th scope="col" className="py-2 pr-3 font-semibold">City</th>
                <th scope="col" className="py-2 pr-3 font-semibold">Status</th>
                <th scope="col" className="py-2 pr-3 font-semibold">Outcome</th>
                <th scope="col" className="py-2 font-semibold">Missing documents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map(({ s, state, sub, missing }, i) => (
                <tr key={s.id} data-print={i > 0 && i % 28 === 0 ? "break" : undefined}>
                  <td className="py-2 pr-3 font-medium">
                    {fullName(s)}
                    <span className="block text-[12px] font-normal text-muted">Cohort {s.scholarship.cohort}</span>
                  </td>
                  <td className="py-2 pr-3">{uniOf(data, s)?.name}</td>
                  <td className="py-2 pr-3">{cityOf(data, s)}</td>
                  <td className="py-2 pr-3">
                    <StatusPill status={state} size="sm" />
                  </td>
                  <td className="py-2 pr-3">{sub && sub.status !== "draft" ? OUTCOME_LABEL[sub.outcome] : "Not declared"}</td>
                  <td className="py-2 text-muted">{missing.length ? missing.map((m) => m.label).join(", ") : "None"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="t-small mt-6 text-muted">Sample data from the ZISAR portal prototype. Verified means a named ZISAR verifier checked the official sheet.</p>
      </article>
    </>
  );
}
