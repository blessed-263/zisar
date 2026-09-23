"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatText as MessageSquare, Phone, Airplane as Plane, Siren } from "@phosphor-icons/react";
import { useDemo } from "@/lib/store";
import { cityOf, fullName } from "@/lib/selectors";
import type { HelpRequest } from "@/lib/types";
import { formatDate, formatDateTime, relativeDays } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Tabs } from "@/components/ui/tabs";
import { Avatar, KeyValue, PageHeader, Row } from "@/components/blocks";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { Guard } from "@/components/Guard";
import { Thread } from "@/components/welfare/Thread";

type Tab = "alerts" | "help" | "travel";

export default function WelfarePage() {
  return (
    <Guard area="welfare">
      <Welfare />
    </Guard>
  );
}

function Welfare() {
  const data = useDemo((s) => s.data);
  const params = useSearchParams();
  const router = useRouter();
  const tab = (params.get("tab") as Tab) || "alerts";
  const today = new Date().toISOString().slice(0, 10);
  const unreceived = data.alerts.filter((a) => !a.receivedBy).length;
  const openHelp = data.help.filter((h) => h.status === "open").length;
  const overdue = data.travel.filter((t) => t.status === "open" && t.returnDate.slice(0, 10) < today).length;

  return (
    <>
      <PageHeader
        label="Welfare office"
        title="Welfare"
        description="Only the two welfare officers see this page. Opening a request is logged; the content of alerts and requests is never shown to other roles."
      />
      <Tabs<Tab>
        label="Welfare"
        value={tab}
        onChange={(v) => router.replace(`/admin/welfare?tab=${v}`)}
        items={[
          { value: "alerts", label: "Emergency alerts", count: unreceived },
          { value: "help", label: "Help requests", count: openHelp },
          { value: "travel", label: "Travel", count: overdue },
        ]}
        className="mb-6"
      />
      {tab === "alerts" && <Alerts />}
      {tab === "help" && <Help />}
      {tab === "travel" && <Travel />}
    </>
  );
}

function Alerts() {
  const data = useDemo((s) => s.data);
  const markReceived = useDemo((s) => s.markAlertReceived);
  if (!data.alerts.length) return <EmptyState icon={Siren} title="No alerts. When a student sends one, it appears here and on your phone." />;
  return (
    <div className="flex flex-col gap-3">
      {data.alerts.map((a) => {
        const s = data.students.find((x) => x.id === a.studentId);
        return (
          <Card key={a.id} className={a.receivedBy ? "p-4" : "anim-fade border-danger/50 bg-danger-soft/40 p-4"}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex flex-1 items-center gap-3">
                <Avatar name={fullName(s)} photo={s?.photo} size={48} />
                <div className="flex flex-col">
                  <span className="flex items-center gap-2 font-semibold">
                    {fullName(s)}
                    {!a.receivedBy && <StatusPill status="pending" label="Needs a call" size="sm" />}
                  </span>
                  <span className="t-small text-muted">
                    {a.city} · sent {formatDateTime(a.at)}
                  </span>
                  {a.receivedBy && (
                    <span className="t-small text-muted">
                      Received by {a.receivedBy} at {formatDateTime(a.receivedAt)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="secondary">
                  <a href={`tel:${a.phone.replace(/\s/g, "")}`}>
                    <Phone className="size-4" aria-hidden />
                    {a.phone}
                  </a>
                </Button>
                {!a.receivedBy && (
                  <Button variant="primary" onClick={() => markReceived(a.id)}>
                    I have this
                  </Button>
                )}
              </div>
            </div>
            {!a.receivedBy && s && (
              <div className="mt-4 border-t border-border pt-4">
                <KeyValue
                  items={[
                    ["Next of kin", `${s.emergency.kinName} (${s.emergency.kinRelation}) · ${s.emergency.kinPhone}`],
                    ["Contact in Russia", s.emergency.russiaContact ?? "Not given"],
                    ["Medical", s.emergency.medical ?? "Nothing noted"],
                    ["Address", s.stay.registrationAddress],
                  ]}
                />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function Help() {
  const data = useDemo((s) => s.data);
  const logOpened = useDemo((s) => s.logHelpOpened);
  const [openId, setOpenId] = React.useState<string | null>(null);
  const requests = [...data.help].sort((a, b) => (a.status === "closed" ? 1 : 0) - (b.status === "closed" ? 1 : 0) || b.at.localeCompare(a.at));
  const current = data.help.find((h) => h.id === openId);
  if (!requests.length) return <EmptyState icon={MessageSquare} title="No help requests." />;
  return (
    <>
      <Card className="overflow-hidden divide-y divide-border">
        {requests.map((h) => {
          const s = data.students.find((x) => x.id === h.studentId);
          return (
            <Row
              key={h.id}
              icon={MessageSquare}
              title={h.subject}
              meta={`${fullName(s)} · ${h.city} · ${formatDate(h.at)}`}
              trailing={<StatusPill status={h.status} size="sm" />}
              onClick={() => {
                logOpened(h.id);
                setOpenId(h.id);
              }}
            />
          );
        })}
      </Card>
      {current && <HelpSheet request={current} onClose={() => setOpenId(null)} />}
    </>
  );
}

function HelpSheet({ request: h, onClose }: { request: HelpRequest; onClose: () => void }) {
  const data = useDemo((s) => s.data);
  const replyHelp = useDemo((s) => s.replyHelp);
  const setStatus = useDemo((s) => s.setHelpStatus);
  const s = data.students.find((x) => x.id === h.studentId);
  return (
    <Sheet
      open
      onOpenChange={(o) => !o && onClose()}
      title={h.subject}
      description={`${fullName(s)} · ${h.city} · ${h.phone}`}
      size="lg"
      footer={
        h.status === "closed" ? (
          <Button variant="secondary" onClick={() => setStatus(h.id, "open")}>
            Reopen
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => setStatus(h.id, "closed")}>
            Close request
          </Button>
        )
      }
    >
      <Thread request={h} mine="officer" closed={h.status === "closed"} onReply={(t) => replyHelp(h.id, t, false)} />
    </Sheet>
  );
}

function Travel() {
  const data = useDemo((s) => s.data);
  const today = new Date().toISOString().slice(0, 10);
  const open = data.travel
    .filter((t) => t.status === "open")
    .sort((a, b) => a.returnDate.localeCompare(b.returnDate));
  if (!open.length) return <EmptyState icon={Plane} title="Nobody is travelling." />;
  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-[14px]">
        <thead className="t-label border-b border-border">
          <tr>
            <th className="px-4 py-3 font-medium">Student</th>
            <th className="px-4 py-3 font-medium">City</th>
            <th className="px-4 py-3 font-medium">Reason</th>
            <th className="px-4 py-3 font-medium">Dates</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {open.map((t) => {
            const s = data.students.find((x) => x.id === t.studentId);
            const overdue = t.returnDate.slice(0, 10) < today;
            const away = t.leave.slice(0, 10) <= today;
            return (
              <tr key={t.id}>
                <td className="px-4 py-3 font-medium">{fullName(s)}</td>
                <td className="px-4 py-3 text-muted">{cityOf(data, s)}</td>
                <td className="px-4 py-3">{t.reason}</td>
                <td className="tabular px-4 py-3">
                  {formatDate(t.leave)} to {formatDate(t.returnDate)}
                </td>
                <td className="px-4 py-3">
                  {overdue ? (
                    <StatusPill status="overdue" label={`Due back ${relativeDays(t.returnDate)}`} size="sm" />
                  ) : (
                    <StatusPill status={away ? "open" : "pending"} label={away ? "Away" : "Leaving soon"} size="sm" />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
