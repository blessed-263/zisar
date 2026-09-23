"use client";

import { WarningOctagon as AlertOctagon, BookOpen, Handshake as HeartHandshake, Tray as Inbox, Lifebuoy as LifeBuoy, MapPin, ChatCircle as MessageCircle, Airplane as Plane, Scales as Scale, Users, CheckSquare as Vote } from "@phosphor-icons/react";
import { useDemo, useActor, useCurrentApplicant } from "@/lib/store";
import { COORDINATOR_CITY, COORDINATOR_UNIVERSITY, REP_CITY, roleMeta } from "@/lib/constants";
import { cityOf, expiringItems, fullName, profileCompleteness, turnout, ELECTION_STAGES } from "@/lib/selectors";
import { citySlug } from "@/lib/cities";
import { daysUntil, formatDate, formatDateTime } from "@/lib/utils";
import { PageHeader, LinkButton, Row } from "@/components/blocks";
import { StatCard } from "@/components/StatCard";
import { Card, CardHeader } from "@/components/ui/card";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";

function Greeting({ role }: { role: Parameters<typeof roleMeta>[0] }) {
  const actor = useActor();
  return <PageHeader label={roleMeta(role).label} title={`Hello, ${actor.split(" ")[0]}`} description={roleMeta(role).description} />;
}

export function VerifierHome() {
  const data = useDemo((s) => s.data);
  const waiting = data.submissions.filter((s) => s.status === "submitted");
  const docs = data.documents.filter((d) => d.status === "received");
  const queried = data.submissions.filter((s) => s.status === "queried");
  const openWin = data.windows.find((w) => new Date(w.opens) <= new Date() && new Date() <= new Date(w.deadline));
  return (
    <>
      <Greeting role="verifier" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Results waiting" value={waiting.length} tone="info" href="/admin/queue" />
        <StatCard label="Documents waiting" value={docs.length} tone="info" href="/admin/queue?tab=documents" />
        <StatCard label="Queried, waiting on student" value={queried.length} tone="warning" />
        <StatCard label="Window closes" value={openWin ? formatDate(openWin.deadline) : "None open"} change={openWin?.name} />
      </div>
      <Card className="mt-6 overflow-hidden">
        <CardHeader title="Oldest in the queue" action={<LinkButton href="/admin/queue" size="sm" variant="primary">Open queue</LinkButton>} />
        <div className="mt-3 divide-y divide-border border-t border-border">
          {waiting.length === 0 ? (
            <div className="p-5"><EmptyState icon={Inbox} title="The queue is empty. Nothing is waiting for a decision." /></div>
          ) : (
            waiting
              .map((sub) => ({ sub, at: sub.events.filter((e) => e.kind === "submitted" || e.kind === "replied").at(-1)?.at ?? "" }))
              .sort((a, b) => a.at.localeCompare(b.at))
              .slice(0, 5)
              .map(({ sub, at }) => (
                <Row
                  key={sub.id}
                  href={`/admin/review/${sub.id}`}
                  icon={Inbox}
                  title={fullName(data.students.find((x) => x.id === sub.studentId))}
                  meta={`${data.windows.find((w) => w.id === sub.windowId)?.name} · waiting since ${formatDate(at)}`}
                  trailing={<StatusPill status="submitted" size="sm" />}
                />
              ))
          )}
        </div>
      </Card>
    </>
  );
}

export function AppealsHome() {
  const data = useDemo((s) => s.data);
  const pending = data.submissions.filter((s) => s.appeal?.status === "pending");
  const decided = data.submissions.filter((s) => s.appeal && s.appeal.status !== "pending");
  return (
    <>
      <Greeting role="appeals" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard label="Appeals waiting" value={pending.length} tone="info" href="/admin/appeals" />
        <StatCard label="Decided this year" value={decided.length} />
      </div>
      <Card className="mt-6 overflow-hidden">
        <CardHeader title="Waiting for you" action={<LinkButton href="/admin/appeals" size="sm" variant="primary">Open appeals</LinkButton>} />
        <div className="mt-3 divide-y divide-border border-t border-border">
          {pending.length === 0 ? (
            <div className="p-5"><EmptyState icon={Scale} title="No appeals are waiting." /></div>
          ) : (
            pending.map((sub) => (
              <Row
                key={sub.id}
                href={`/admin/appeals?id=${sub.id}`}
                icon={Scale}
                title={fullName(data.students.find((x) => x.id === sub.studentId))}
                meta={`${data.windows.find((w) => w.id === sub.windowId)?.name} · appealed ${formatDate(sub.appeal?.submittedAt)}`}
                trailing={<StatusPill status="pending" size="sm" />}
              />
            ))
          )}
        </div>
      </Card>
    </>
  );
}

export function WelfareHome() {
  const data = useDemo((s) => s.data);
  const alerts = data.alerts.filter((a) => !a.receivedBy);
  const help = data.help.filter((h) => h.status === "open");
  const overdue = data.travel.filter((t) => t.status === "open" && daysUntil(t.returnDate) < 0);
  return (
    <>
      <Greeting role="welfare" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard label="Emergency alerts" value={alerts.length} tone={alerts.length ? "danger" : "default"} href="/admin/welfare" />
        <StatCard label="Open help requests" value={help.length} tone="info" href="/admin/welfare?tab=help" />
        <StatCard label="Overdue returns" value={overdue.length} tone={overdue.length ? "warning" : "default"} href="/admin/welfare?tab=travel" />
      </div>
      <Card className="mt-6 overflow-hidden">
        <CardHeader title="Needs a response" action={<LinkButton href="/admin/welfare" size="sm" variant="primary">Open welfare office</LinkButton>} />
        <div className="mt-3 divide-y divide-border border-t border-border">
          {alerts.length + help.length === 0 && (
            <div className="p-5"><EmptyState icon={HeartHandshake} title="Nothing is waiting. Every alert has been received." /></div>
          )}
          {alerts.map((a) => (
            <Row key={a.id} href="/admin/welfare" icon={AlertOctagon} title={`Alert from ${fullName(data.students.find((x) => x.id === a.studentId))}`} meta={`${a.city} · ${formatDateTime(a.at)}`} trailing={<StatusPill status="overdue" label="Not received" size="sm" />} />
          ))}
          {help.map((h) => (
            <Row key={h.id} href={`/admin/welfare?tab=help&id=${h.id}`} icon={LifeBuoy} title={h.subject} meta={`${h.city} · ${formatDate(h.at)}`} trailing={<StatusPill status="open" size="sm" />} />
          ))}
          {overdue.map((t) => (
            <Row key={t.id} href="/admin/welfare?tab=travel" icon={Plane} title={`${fullName(data.students.find((x) => x.id === t.studentId))} has not confirmed return`} meta={`Due back ${formatDate(t.returnDate)}`} />
          ))}
        </div>
      </Card>
    </>
  );
}

export function CoordinatorHome() {
  const data = useDemo((s) => s.data);
  const mine = data.students.filter((s) => cityOf(data, s) === COORDINATOR_CITY);
  const expiring = mine.filter((s) => expiringItems(s, 30).length > 0);
  const incomplete = mine.filter((s) => profileCompleteness(s) < 100);
  const guide = data.guides.find((g) => g.universityId === COORDINATOR_UNIVERSITY);
  const newcomers = mine.filter((s) => s.studies.stage === "preparatory");
  return (
    <>
      <Greeting role="coordinator" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label={`Students in ${COORDINATOR_CITY}`} value={mine.length} href="/admin/coordinator" />
        <StatCard label="Expiring in 30 days" value={expiring.length} tone={expiring.length ? "warning" : "default"} href="/admin/coordinator" />
        <StatCard label="Incomplete profiles" value={incomplete.length} href="/admin/coordinator" />
        <StatCard label="Newcomers" value={newcomers.length} href="/admin/coordinator/mentors" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader title="Expiring soon" />
          <div className="mt-3 divide-y divide-border border-t border-border">
            {expiring.length === 0 ? (
              <p className="p-5 text-muted">Nothing expires in the next 30 days.</p>
            ) : (
              expiring.map((s) => (
                <Row key={s.id} href="/admin/coordinator" icon={Users} title={fullName(s)} meta={expiringItems(s, 30).map((i) => `${i.label} ${formatDate(i.date)}`).join(" · ")} />
              ))
            )}
          </div>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader title="Your university guide" description={guide ? `Last updated ${formatDate(guide.updatedAt)} by ${guide.updatedBy}` : undefined} />
          <div className="mt-3 border-t border-border">
            <Row href="/admin/coordinator/guide" icon={BookOpen} title="Edit the guide" meta={`${guide?.sections.length ?? 0} sections`} />
          </div>
        </Card>
      </div>
    </>
  );
}

export function OfficerHome() {
  const data = useDemo((s) => s.data);
  const e = data.elections.find((x) => x.status !== "archived") ?? data.elections[0];
  const t = turnout(data, e);
  const stage = ELECTION_STAGES.find((s) => s.status === e.status);
  const pending = e.nominations.filter((n) => n.status === "pending").length;
  return (
    <>
      <Greeting role="officer" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Stage" value={stage?.label ?? e.status} change={e.title} />
        <StatCard label="Turnout" value={`${t.pct}%`} change={`${t.voted} of ${t.eligible} eligible · quorum ${e.quorumPct}%`} tone={t.pct >= e.quorumPct ? "success" : "warning"} />
        <StatCard label="Nominations to vet" value={pending} tone={pending ? "info" : "default"} />
        <StatCard label="Voting closes" value={formatDate(e.votingCloses)} />
      </div>
      <Card className="mt-6 overflow-hidden">
        <Row href="/admin/elections" icon={Vote} title="Open the election console" meta="Stages, vetting, turnout, and results. Individual choices are never shown." />
      </Card>
    </>
  );
}

export function ApplicantHome() {
  const data = useDemo((s) => s.data);
  const applicant = useCurrentApplicant();
  const actor = useActor();
  if (!applicant) return null;
  const followed = applicant.followedCities;
  const articles = data.cityArticles
    .filter((a) => followed.includes(a.city))
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 4);
  const openEq = data.enquiries.filter((e) => e.applicantId === applicant.id && e.status !== "closed");
  return (
    <>
      <PageHeader
        label="Applicant"
        title={`Hello, ${actor.split(" ")[0]}`}
        description={`Temp account · ends ${formatDate(applicant.expiresAt)}. Join cities, read the briefs, ask a representative.`}
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard label="Cities joined" value={followed.length} href="/regions" />
        <StatCard label="Open questions" value={openEq.length} tone={openEq.length ? "info" : "default"} href="/enquiries" />
        <StatCard label="Home province" value={applicant.province} change={applicant.district} />
      </div>
      <Card className="mt-6 overflow-hidden">
        <CardHeader
          title="Your cities"
          action={
            <LinkButton href="/regions" size="sm" variant="primary">
              Browse cities
            </LinkButton>
          }
        />
        <div className="mt-3 divide-y divide-border border-t border-border">
          {followed.length === 0 ? (
            <div className="p-5">
              <EmptyState icon={MapPin} title="Join a city to follow its news and talk to the representative." />
            </div>
          ) : (
            followed.map((city) => {
              const brief = data.cityBriefs.find((b) => b.city === city);
              return (
                <Row key={city} href={`/regions/${citySlug(city)}`} icon={MapPin} title={city} meta={brief?.intro} />
              );
            })
          )}
        </div>
      </Card>
      {articles.length > 0 && (
        <Card className="mt-6 overflow-hidden">
          <CardHeader title="Latest from cities you joined" />
          <div className="mt-3 divide-y divide-border border-t border-border">
            {articles.map((a) => (
              <Row
                key={a.id}
                href={`/regions/${citySlug(a.city)}/articles/${a.id}`}
                icon={BookOpen}
                title={a.title}
                meta={`${a.city} · ${formatDate(a.at)}`}
              />
            ))}
          </div>
        </Card>
      )}
    </>
  );
}

export function RepHome() {
  const data = useDemo((s) => s.data);
  const open = data.enquiries.filter((e) => e.city === REP_CITY && e.status === "open");
  const answered = data.enquiries.filter((e) => e.city === REP_CITY && e.status === "answered");
  const brief = data.cityBriefs.find((b) => b.city === REP_CITY);
  const articles = data.cityArticles.filter((a) => a.city === REP_CITY).length;
  return (
    <>
      <Greeting role="rep" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Open enquiries" value={open.length} tone={open.length ? "info" : "default"} href="/admin/enquiries" />
        <StatCard label="Answered" value={answered.length} href="/admin/enquiries" />
        <StatCard label="City articles" value={articles} href="/admin/city-articles" />
        <StatCard label="Brief updated" value={brief ? formatDate(brief.updatedAt) : "—"} href="/admin/city-brief" />
      </div>
      <Card className="mt-6 overflow-hidden">
        <CardHeader title="Waiting for you" action={<LinkButton href="/admin/enquiries" size="sm" variant="primary">Open inbox</LinkButton>} />
        <div className="mt-3 divide-y divide-border border-t border-border">
          {open.length === 0 ? (
            <div className="p-5">
              <EmptyState icon={MessageCircle} title="No open enquiries for your city." />
            </div>
          ) : (
            open.map((e) => {
              const a = data.applicants.find((x) => x.id === e.applicantId);
              return (
                <Row
                  key={e.id}
                  href={`/admin/enquiries/${e.id}`}
                  icon={MessageCircle}
                  title={e.subject}
                  meta={`${a ? `${a.firstNames} ${a.surname}` : "Applicant"} · ${formatDate(e.at)}`}
                  trailing={<StatusPill status="open" size="sm" />}
                />
              );
            })
          )}
        </div>
      </Card>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Row href="/admin/city-brief" icon={BookOpen} title="Edit good, bad, ugly" meta="Honest brief for applicants in Zimbabwe" />
        <Row href={`/regions/${citySlug(REP_CITY)}`} icon={MapPin} title={`View ${REP_CITY} page`} meta="How applicants see your city" />
      </div>
    </>
  );
}
