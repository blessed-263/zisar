"use client";

import { Printer } from "@phosphor-icons/react";
import { useDemo, useCurrentStudent } from "@/lib/store";
import { DOC_TYPES, OUTCOME_LABEL } from "@/lib/constants";
import { currentDocs, currentVersion, fullName, stageLabel, submissionFor, uniOf } from "@/lib/selectors";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/blocks";
import { Logo } from "@/components/Logo";
import { Guard } from "@/components/Guard";

export default function PrintProfilePage() {
  return (
    <Guard area="own-file">
      <PrintProfile />
    </Guard>
  );
}

function PrintProfile() {
  const data = useDemo((s) => s.data);
  const s = useCurrentStudent();
  const uni = uniOf(data, s);
  const docs = currentDocs(data, s.id);
  const rows: [string, string][] = [
    ["Full name", `${s.firstNames} ${s.surname}`],
    ["Date of birth", formatDate(s.dob)],
    ["National ID", s.nationalId],
    ["Passport", `${s.passport.number}, expires ${formatDate(s.passport.expires)}`],
    ["Email", s.contacts.email],
    ["Russian phone", s.contacts.phoneRu],
    ["Scholarship", `${s.scholarship.type}, cohort ${s.scholarship.cohort}`],
    ["University", `${uni?.name}, ${uni?.city}`],
    ["Programme", `${s.studies.programme}, ${stageLabel(s)}`],
    ["Student number", s.studies.studentNumber],
    ["Visa expiry", formatDate(s.stay.visaExpiry)],
    ["Registration expiry", formatDate(s.stay.registrationExpiry)],
    ["Insurance expiry", formatDate(s.stay.insuranceExpiry)],
    ["Next of kin", `${s.emergency.kinName} (${s.emergency.kinRelation}), ${s.emergency.kinPhone}`],
  ];
  return (
    <>
      <div data-print="hide" className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <LinkButton href="/profile" variant="ghost" size="sm">
          Back to profile
        </LinkButton>
        <Button variant="primary" size="sm" onClick={() => window.print()}>
          <Printer className="size-4" aria-hidden />
          Print or save as PDF
        </Button>
      </div>
      <article data-print="page" className="mx-auto max-w-[794px] rounded-[12px] border border-border bg-surface p-8 text-[14px] print:border-0 print:p-0">
        <header className="mb-6 flex items-center justify-between border-b border-border pb-4">
          <Logo size="md" subtitle="My file" />
          <span className="t-small text-muted">Printed {formatDate(new Date().toISOString())}</span>
        </header>
        <h1 className="mb-4 text-[22px] font-semibold">{fullName(s)}</h1>
        <table className="w-full">
          <tbody className="divide-y divide-border">
            {rows.map(([k, v]) => (
              <tr key={k}>
                <th scope="row" className="w-48 py-2 pr-4 text-left font-medium text-muted">
                  {k}
                </th>
                <td className="py-2">{v || "Not set"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2 className="mt-8 mb-2 font-semibold">Semesters</h2>
        <table className="w-full">
          <tbody className="divide-y divide-border">
            {data.windows.map((w) => {
              const sub = submissionFor(data, w.id, s.id);
              return (
                <tr key={w.id}>
                  <th scope="row" className="w-48 py-2 pr-4 text-left font-medium text-muted">
                    {w.name}
                  </th>
                  <td className="py-2">{sub ? `${sub.status[0].toUpperCase()}${sub.status.slice(1)} · ${OUTCOME_LABEL[sub.outcome]}` : "Nothing submitted"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <h2 className="mt-8 mb-2 font-semibold">Documents</h2>
        <table className="w-full">
          <tbody className="divide-y divide-border">
            {DOC_TYPES.filter((d) => docs.has(d.type)).map((d) => {
              const v = currentVersion(docs.get(d.type));
              return (
                <tr key={d.type}>
                  <th scope="row" className="w-48 py-2 pr-4 text-left font-medium text-muted">
                    {d.label}
                  </th>
                  <td className="py-2">
                    {v?.status === "verified" ? "Verified" : "In review"}
                    {v?.expires ? ` · expires ${formatDate(v.expires)}` : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="t-small mt-8 text-muted">Sample data from the ZISAR portal prototype.</p>
      </article>
    </>
  );
}
