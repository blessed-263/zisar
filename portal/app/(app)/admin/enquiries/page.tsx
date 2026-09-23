"use client";

import { ChatCircle as MessageCircle } from "@phosphor-icons/react";
import { useDemo } from "@/lib/store";
import { REP_CITY } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { PageHeader, Row } from "@/components/blocks";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { Guard } from "@/components/Guard";

export default function RepEnquiriesPage() {
  return (
    <Guard area="enquiries-rep">
      <Inbox />
    </Guard>
  );
}

function Inbox() {
  const data = useDemo((s) => s.data);
  const list = data.enquiries
    .filter((e) => e.city === REP_CITY)
    .sort((a, b) => b.at.localeCompare(a.at));

  return (
    <>
      <PageHeader
        label={REP_CITY}
        title="Applicant enquiries"
        description="Questions from applicants in Zimbabwe about your city. Answer honestly — they are choosing where to study."
      />
      {list.length === 0 ? (
        <EmptyState icon={MessageCircle} title="No enquiries for your city yet." />
      ) : (
        <Card className="overflow-hidden">
          <div className="divide-y divide-border">
            {list.map((e) => {
              const a = data.applicants.find((x) => x.id === e.applicantId);
              return (
                <Row
                  key={e.id}
                  href={`/admin/enquiries/${e.id}`}
                  icon={MessageCircle}
                  title={e.subject}
                  meta={`${a ? `${a.firstNames} ${a.surname}` : "Applicant"} · ${formatDate(e.at)}`}
                  trailing={<StatusPill status={e.status} size="sm" />}
                />
              );
            })}
          </div>
        </Card>
      )}
    </>
  );
}
