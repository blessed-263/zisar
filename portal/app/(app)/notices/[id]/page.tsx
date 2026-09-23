"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react";
import { useDemo, useCurrentStudent } from "@/lib/store";
import { audienceLabel } from "@/lib/selectors";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Card, CardBody } from "@/components/ui/card";
import { LinkButton, PageHeader } from "@/components/blocks";
import NotFound from "@/app/not-found";

export default function NoticeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const data = useDemo((s) => s.data);
  const role = useDemo((s) => s.role);
  const markNoticeRead = useDemo((s) => s.markNoticeRead);
  const markAnnouncementRead = useDemo((s) => s.markAnnouncementRead);
  const me = useCurrentStudent();
  const notice = data.notices.find((n) => n.id === id && (role !== "student" || n.studentId === me.id));
  const ann = data.announcements.find((a) => a.id === id);

  React.useEffect(() => {
    if (role !== "student") return;
    if (notice && !notice.read) markNoticeRead(notice.id);
    if (ann && !ann.readBy.includes(me.id)) markAnnouncementRead(ann.id, me.id);
  }, [role, notice, ann, me.id, markNoticeRead, markAnnouncementRead]);

  if (notice) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader crumbs={[{ href: "/notices", label: "Notices" }]} label="For you" title={notice.title} description={formatDateTime(notice.at)} />
        <Card>
          <CardBody className="flex flex-col gap-5 md:py-6">
            <p className="text-[16px] leading-7 whitespace-pre-line">{notice.body}</p>
            {notice.href && (
              <LinkButton href={notice.href} variant="primary" className="self-start">
                Open
                <ArrowRight className="size-4" aria-hidden />
              </LinkButton>
            )}
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!ann) return <NotFound />;
  return (
    <article className="mx-auto max-w-3xl">
      <PageHeader crumbs={[{ href: "/notices", label: "Notices" }]} label={audienceLabel(data, ann)} title={ann.title} description={`${formatDate(ann.at)} · ${ann.by}`} />
      {ann.image && (
         
        <img src={ann.image} alt={ann.alt ?? ""} className="mb-6 aspect-video w-full rounded-[12px] border border-border object-cover" />
      )}
      <div className="flex flex-col gap-4 text-[16px] leading-7">
        {ann.body.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {role === "executive" && (
        <p className="t-small mt-8 text-muted">
          Read by {ann.readBy.length} {ann.readBy.length === 1 ? "student" : "students"}.{" "}
          <Link href="/admin/announcements" className="text-accent hover:underline">
            All announcements
          </Link>
        </p>
      )}
    </article>
  );
}
