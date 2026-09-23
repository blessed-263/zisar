"use client";

import { useParams } from "next/navigation";
import { useDemo } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/blocks";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { Guard } from "@/components/Guard";
import { Thread } from "@/components/welfare/Thread";
import { Lifebuoy as LifeBuoy } from "@phosphor-icons/react";

export default function HelpThreadPage() {
  return (
    <Guard area="own-file">
      <HelpThread />
    </Guard>
  );
}

function HelpThread() {
  const { id } = useParams<{ id: string }>();
  const h = useDemo((s) => s.data.help.find((x) => x.id === id));
  const replyHelp = useDemo((s) => s.replyHelp);
  const setHelpStatus = useDemo((s) => s.setHelpStatus);
  if (!h) return <EmptyState icon={LifeBuoy} title="This request was not found." />;
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/help", label: "Help" }]}
        title={h.subject}
        description={`Opened ${formatDate(h.at)} · only the welfare officers can read this`}
        actions={
          <>
            <StatusPill status={h.status} />
            {h.status !== "closed" && (
              <Button size="sm" variant="secondary" onClick={() => setHelpStatus(h.id, "closed")}>
                Mark resolved
              </Button>
            )}
          </>
        }
      />
      <Card>
        <CardBody>
          <Thread request={h} mine="student" closed={h.status === "closed"} onReply={(t) => replyHelp(h.id, t, true)} />
        </CardBody>
      </Card>
    </>
  );
}
