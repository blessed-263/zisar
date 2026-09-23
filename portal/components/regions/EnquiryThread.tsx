"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChatCircle as MessageCircle } from "@phosphor-icons/react";
import { useDemo, useCurrentApplicant } from "@/lib/store";
import { citySlug } from "@/lib/cities";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";

export function EnquiryThread({ forRep }: { forRep?: boolean }) {
  const params = useParams<{ id: string }>();
  const data = useDemo((s) => s.data);
  const role = useDemo((s) => s.role);
  const applicant = useCurrentApplicant();
  const replyEnquiry = useDemo((s) => s.replyEnquiry);
  const setEnquiryStatus = useDemo((s) => s.setEnquiryStatus);
  const e = data.enquiries.find((x) => x.id === params.id);
  const [text, setText] = React.useState("");

  if (!e) {
    return <EmptyState icon={MessageCircle} title="Enquiry not found." />;
  }

  const applicantOk = role === "applicant" && e.applicantId === applicant?.id;
  const repOk = !!forRep && role === "rep";
  if (!applicantOk && !repOk && role !== "executive") {
    return <EmptyState icon={MessageCircle} title="You cannot open this enquiry." />;
  }

  const other = data.applicants.find((a) => a.id === e.applicantId);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <Link href={forRep ? "/admin/enquiries" : "/enquiries"} className="t-small text-muted hover:text-text">
          ← All enquiries
        </Link>
        <h1 className="font-display mt-2 text-[28px] font-medium tracking-[-0.03em]">{e.subject}</h1>
        <p className="t-small mt-1 text-muted">
          {e.city}
          {other ? ` · ${other.firstNames} ${other.surname}` : ""} ·{" "}
          <Link href={`/regions/${citySlug(e.city)}`} className="text-accent hover:underline">
            City page
          </Link>
        </p>
        <div className="mt-2">
          <StatusPill status={e.status} size="sm" />
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {e.messages.map((m, i) => (
          <li
            key={i}
            className={`rounded-[14px] border border-border px-4 py-3 ${m.fromApplicant ? "bg-surface" : "bg-surface-muted/80"}`}
          >
            <p className="t-small text-muted">
              {m.by} · {formatDateTime(m.at)}
            </p>
            <p className="mt-1 text-[15px] leading-6 whitespace-pre-wrap">{m.text}</p>
          </li>
        ))}
      </ul>

      {(applicantOk || repOk) && e.status !== "closed" && (
        <form
          className="flex flex-col gap-3"
          onSubmit={(ev) => {
            ev.preventDefault();
            if (!text.trim()) return;
            replyEnquiry(e.id, text.trim(), !!applicantOk);
            setText("");
          }}
        >
          <Textarea
            value={text}
            onChange={(ev) => setText(ev.target.value)}
            placeholder={applicantOk ? "Follow-up question…" : "Your reply to the applicant…"}
            rows={4}
          />
          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant="primary">
              Send reply
            </Button>
            {repOk && (
              <Button type="button" variant="secondary" onClick={() => setEnquiryStatus(e.id, "closed")}>
                Close enquiry
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
