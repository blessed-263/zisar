"use client";

import * as React from "react";
import Link from "next/link";
import { ChatCircle as MessageCircle } from "@phosphor-icons/react";
import { useDemo, useCurrentApplicant } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { PageHeader, Row, LinkButton } from "@/components/blocks";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";

export default function ApplicantEnquiriesPage() {
  const data = useDemo((s) => s.data);
  const role = useDemo((s) => s.role);
  const applicant = useCurrentApplicant();
  const mine = data.enquiries
    .filter((e) => role === "applicant" && e.applicantId === applicant?.id)
    .sort((a, b) => b.at.localeCompare(a.at));

  if (role !== "applicant") {
    return (
      <EmptyState
        icon={MessageCircle}
        title="Sign in as an applicant to see questions you sent to city representatives."
      />
    );
  }

  return (
    <>
      <PageHeader
        label="Before you travel"
        title="Ask a representative"
        description="Questions you sent about cities you are considering."
      />
      {mine.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="No questions yet. Open a city, read the brief, then ask."
          action={
            <LinkButton href="/regions" size="sm" variant="primary">
              Browse cities
            </LinkButton>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="divide-y divide-border">
            {mine.map((e) => (
              <Row
                key={e.id}
                href={`/enquiries/${e.id}`}
                icon={MessageCircle}
                title={e.subject}
                meta={`${e.city} · ${formatDate(e.at)} · ${e.messages.length} messages`}
                trailing={<StatusPill status={e.status} size="sm" />}
              />
            ))}
          </div>
        </Card>
      )}
      <p className="t-small mt-4 text-muted">
        Looking for a city?{" "}
        <Link href="/regions" className="font-medium text-accent hover:underline">
          Browse all cities
        </Link>
        .
      </p>
    </>
  );
}
