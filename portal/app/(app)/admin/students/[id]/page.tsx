"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GraduationCap, Airplane as Plane } from "@phosphor-icons/react";
import { useDemo, withUndo } from "@/lib/store";
import { COORDINATOR_CITY, DOC_TYPES, OUTCOME_LABEL } from "@/lib/constants";
import { cityOf, currentDocs, currentVersion, fullName, profileCompleteness, stageLabel, submissionFor, uniOf } from "@/lib/selectors";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Card, CardBody, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Avatar, KeyValue, Notice, PageHeader, Row } from "@/components/blocks";
import { StatusPill } from "@/components/StatusPill";
import { Timeline } from "@/components/Timeline";
import { EmptyState } from "@/components/EmptyState";
import { Forbidden, Guard } from "@/components/Guard";
import NotFound from "@/app/not-found";

export default function StudentDetailPage() {
  return (
    <Guard area="students">
      <StudentDetail />
    </Guard>
  );
}

type Tab = "profile" | "semesters" | "documents" | "travel" | "history";

function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const data = useDemo((s) => s.data);
  const role = useDemo((s) => s.role);
  const confirmGraduation = useDemo((s) => s.confirmGraduation);
  const [tab, setTab] = React.useState<Tab>("profile");
  const s = data.students.find((x) => x.id === id);
  if (!s) return <NotFound />;
  if (role === "coordinator" && cityOf(data, s) !== COORDINATOR_CITY)
    return <Forbidden rule={`Coordinators open files for students in their own city only. This student is in ${cityOf(data, s)}.`} />;

  const uni = uniOf(data, s);
  const docs = currentDocs(data, s.id);
  const travel = data.travel.filter((t) => t.studentId === s.id);
  const name = fullName(s);
  const audit = data.audit.filter((a) => a.target.startsWith(name) && !/help|alert/i.test(a.action));

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/admin/students", label: "Students" }, { href: `/admin/students/${s.id}`, label: name }]}
        title={
          <span className="flex items-center gap-3">
            <Avatar name={name} photo={s.photo} size={44} />
            {name}
          </span>
        }
        description={`${uni?.name}, ${uni?.city} · ${stageLabel(s)} · ${s.scholarship.type}, cohort ${s.scholarship.cohort}`}
        actions={<StatusPill status="enrolled" label={s.studies.academicStatus[0].toUpperCase() + s.studies.academicStatus.slice(1)} />}
      />

      {s.graduation?.status === "sent" && (
        <Notice
          tone="info"
          icon={GraduationCap}
          title="Graduation and return record waiting for confirmation"
          className="mb-6"
          action={
            role === "verifier" ? (
              <Button variant="primary" size="sm" onClick={() => withUndo("Graduation record confirmed", () => confirmGraduation(s.id))}>
                Confirm record
              </Button>
            ) : undefined
          }
        >
          Leaving {formatDate(s.graduation.leaveDate)} for {s.graduation.zwTown}. Certificate: {s.graduation.certificateFile ?? "not attached"}.
          {role !== "verifier" && " A verifier confirms it."}
        </Notice>
      )}

      <Tabs<Tab>
        label="Student file"
        value={tab}
        onChange={setTab}
        className="mb-6"
        items={[
          { value: "profile", label: "Profile" },
          { value: "semesters", label: "Semesters", count: data.submissions.filter((x) => x.studentId === s.id).length },
          { value: "documents", label: "Documents", count: docs.size },
          { value: "travel", label: "Travel", count: travel.length },
          { value: "history", label: "History" },
        ]}
      />

      {tab === "profile" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Identity and contacts" description={`Profile ${profileCompleteness(s)}% complete`} />
            <CardBody>
              <KeyValue
                items={[
                  ["Full name", `${s.firstNames} ${s.surname}`],
                  ["Date of birth", formatDate(s.dob)],
                  ["Passport", `${s.passport.number}, expires ${formatDate(s.passport.expires)}`],
                  ["National ID", s.nationalId],
                  ["Email", s.contacts.email],
                  ["Russian phone", s.contacts.phoneRu],
                  ["Origin", `${s.district}, ${s.province}`],
                  ["Telegram", s.contacts.telegram],
                ]}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Studies" />
            <CardBody>
              <KeyValue
                items={[
                  ["Faculty", s.studies.faculty],
                  ["Programme", s.studies.programme],
                  ["Student number", s.studies.studentNumber],
                  ["Language", s.studies.language],
                  ["Started", formatDate(s.studies.started)],
                  ["Expected finish", formatDate(s.studies.expectedFinish)],
                ]}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Stay in Russia" />
            <CardBody>
              <KeyValue
                items={[
                  ["Visa expiry", formatDate(s.stay.visaExpiry)],
                  ["Registration expiry", formatDate(s.stay.registrationExpiry)],
                  ["Migration card expiry", formatDate(s.stay.migrationExpiry)],
                  ["Insurance", `${s.stay.insurer}, expires ${formatDate(s.stay.insuranceExpiry)}`],
                  ["Housing", s.stay.housing],
                  ["Address", s.stay.registrationAddress],
                ]}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Emergency" description="Medical notes are visible to welfare officers only." />
            <CardBody>
              <KeyValue
                items={[
                  ["Next of kin", `${s.emergency.kinName} (${s.emergency.kinRelation})`],
                  ["Phone", s.emergency.kinPhone],
                  ["Town", s.emergency.kinTown],
                  ["Contact in Russia", s.emergency.russiaContact],
                ]}
              />
            </CardBody>
          </Card>
        </div>
      )}

      {tab === "semesters" && (
        <div className="flex flex-col gap-4">
          {data.windows.map((w) => {
            const sub = submissionFor(data, w.id, s.id);
            return (
              <Card key={w.id}>
                <CardHeader
                  title={w.name}
                  description={sub ? OUTCOME_LABEL[sub.outcome] : "Nothing submitted"}
                  action={<StatusPill status={sub?.status ?? "not-started"} size="sm" />}
                />
                {sub && (
                  <>
                    <CardBody>
                      <Timeline events={sub.events} />
                    </CardBody>
                    {role === "verifier" && sub.status === "submitted" && (
                      <CardFooter>
                        <Link href={`/admin/review/${sub.id}`} className="font-medium text-accent hover:underline">
                          Review this submission
                        </Link>
                      </CardFooter>
                    )}
                  </>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {tab === "documents" && (
        <Card className="divide-y divide-border overflow-hidden">
          {DOC_TYPES.filter((d) => docs.has(d.type)).map((d) => {
            const versions = docs.get(d.type)!;
            const cur = currentVersion(versions);
            return (
              <Row
                key={d.type}
                href={role === "verifier" ? `/admin/documents/${versions[0].id}` : undefined}
                title={d.label}
                meta={`${versions.length} ${versions.length === 1 ? "version" : "versions"}${cur?.expires ? ` · expires ${formatDate(cur.expires)}` : ""}`}
                trailing={<StatusPill status={versions[0].status} size="sm" />}
              />
            );
          })}
          {DOC_TYPES.filter((d) => d.required && !docs.has(d.type)).map((d) => (
            <Row key={d.type} title={d.label} meta="Not uploaded" trailing={<StatusPill status="overdue" label="Missing" size="sm" />} />
          ))}
        </Card>
      )}

      {tab === "travel" &&
        (travel.length === 0 ? (
          <EmptyState icon={Plane} title="No travel notices on file." />
        ) : (
          <Card className="divide-y divide-border overflow-hidden">
            {travel.map((t) => (
              <Row
                key={t.id}
                icon={Plane}
                title={`${t.reason}: ${formatDate(t.leave)} to ${formatDate(t.returnDate)}`}
                meta={t.status === "closed" ? `Returned, confirmed ${formatDate(t.closedAt)}` : t.reRegister ? "Needs to re-register on return" : undefined}
                trailing={<StatusPill status={t.status === "open" ? (new Date(t.returnDate) < new Date() ? "overdue" : "open") : "closed"} size="sm" />}
              />
            ))}
          </Card>
        ))}

      {tab === "history" && (
        <Card className="overflow-hidden">
          <CardHeader title="Audit entries for this student" description="Help requests are never shown here." />
          <ul className="mt-3 divide-y divide-border border-t border-border">
            {audit.length === 0 && <li className="px-5 py-4 text-muted">No entries.</li>}
            {audit.map((a) => (
              <li key={a.id} className="flex flex-col gap-0.5 px-4 py-3 md:px-5">
                <span className="font-medium">{a.action}</span>
                <span className="t-small text-muted">
                  {a.actor} · {formatDateTime(a.at)}
                  {a.detail ? ` · ${a.detail}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
