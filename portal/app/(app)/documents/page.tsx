"use client";

import { useDemo, useCurrentStudent } from "@/lib/store";
import { DOC_TYPES } from "@/lib/constants";
import { currentDocs, currentVersion, missingRequiredDocs } from "@/lib/selectors";
import type { DocType } from "@/lib/types";
import { PageHeader, Notice } from "@/components/blocks";
import { DocumentTile } from "@/components/DocumentTile";
import { Guard } from "@/components/Guard";

const GROUPS: { label: string; types: DocType[] }[] = [
  { label: "Identity", types: ["passport", "national-id", "birth-certificate"] },
  { label: "Stay in Russia", types: ["visa", "migration-card", "registration", "insurance", "medical"] },
  { label: "Studies", types: ["enrolment", "student-card", "green-card", "school-results", "prior-degree", "degree-certificate"] },
];

export default function DocumentsPage() {
  return (
    <Guard area="own-file">
      <Documents />
    </Guard>
  );
}

function Documents() {
  const data = useDemo((s) => s.data);
  const s = useCurrentStudent();
  const docs = currentDocs(data, s.id);
  const missing = missingRequiredDocs(data, s);
  const senior = s.scholarship.level === "master" || s.scholarship.level === "phd";
  return (
    <>
      <PageHeader
        title="Documents"
        description="One place for every document ZISAR needs. Each upload is kept as a version, so nothing is overwritten."
      />
      {missing.length > 0 && (
        <Notice tone="warning" title={`${missing.length} required ${missing.length === 1 ? "document is" : "documents are"} missing`} className="mb-6">
          {missing.map((d) => d.label).join(", ")}.
        </Notice>
      )}
      <div className="flex flex-col gap-8">
        {GROUPS.map((g) => (
          <section key={g.label} aria-labelledby={`g-${g.label}`}>
            <h2 id={`g-${g.label}`} className="t-label mb-3">
              {g.label}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.types
                .map((t) => DOC_TYPES.find((d) => d.type === t)!)
                .filter((d) => !d.masterOnly || senior)
                .map((d) => {
                  const versions = docs.get(d.type) ?? [];
                  const required = missing.some((m) => m.type === d.type) || (d.required && versions.length > 0);
                  return <DocumentTile key={d.type} type={d.type} versions={versions} current={currentVersion(versions)} required={required} />;
                })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
