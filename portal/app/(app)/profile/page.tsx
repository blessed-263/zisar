"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Camera, FileJs as FileJson, FolderOpen, GraduationCap, Printer, ShieldCheck } from "@phosphor-icons/react";
import { useDemo, useCurrentStudent, toast, withUndo } from "@/lib/store";
import { CONSENT_TEXT, DEMO_STUDENT_ID, OUTCOME_LABEL } from "@/lib/constants";
import { currentDocs, fullName, profileCompleteness, profileSections, submissionFor } from "@/lib/selectors";
import { downloadBlob, fileToDataUrl, formatDate } from "@/lib/utils";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/field";
import { Sheet } from "@/components/ui/sheet";
import { Avatar, LinkButton, Notice, PageHeader, Progress, Row } from "@/components/blocks";
import { Stepper } from "@/components/Stepper";
import { StatusPill } from "@/components/StatusPill";
import { Guard } from "@/components/Guard";
import { SectionForm, type FieldSpec } from "@/components/profile/SectionForm";

export default function ProfilePage() {
  return (
    <Guard area="own-file">
      <Profile />
    </Guard>
  );
}

function Profile() {
  const data = useDemo((s) => s.data);
  const universities = data.universities;
  const s = useCurrentStudent();
  const updateStudent = useDemo((x) => x.updateStudent);
  const params = useSearchParams();
  const router = useRouter();
  const sections = profileSections(s, data);
  const active = params.get("section") ?? "identity";
  const pct = profileCompleteness(s);
  const [consentOpen, setConsentOpen] = React.useState(false);
  const photoRef = React.useRef<HTMLInputElement>(null);

  const select = (id: string) => router.replace(`/profile?section=${id}`, { scroll: false });
  const save = (label: string) => (patch: Record<string, unknown>) =>
    withUndo(`${label} saved`, () => updateStudent(DEMO_STUDENT_ID, patch));

  const FIELDS: Record<string, FieldSpec[]> = {
    identity: [
      { path: "surname", label: "Surname", required: true, hint: "As on your passport" },
      { path: "firstNames", label: "First names", required: true, hint: "As on your passport" },
      { path: "preferredName", label: "Preferred name", optional: true, hint: "What people call you" },
      { path: "dob", label: "Date of birth", type: "date", required: true },
      { path: "sex", label: "Sex", type: "select", required: true, options: [{ value: "Female", label: "Female" }, { value: "Male", label: "Male" }] },
      { path: "nationalId", label: "National ID number", required: true },
      { path: "passport.number", label: "Passport number", required: true },
      { path: "passport.expires", label: "Passport expiry", type: "date", required: true },
      { path: "district", label: "District of origin", required: true },
      { path: "province", label: "Province", required: true },
    ],
    contacts: [
      { path: "contacts.email", label: "Email", type: "email", required: true, hint: "Decisions are always sent here" },
      { path: "contacts.phoneRu", label: "Russian phone", type: "tel", required: true },
      { path: "contacts.phoneZw", label: "Zimbabwe phone", type: "tel", optional: true },
      { path: "contacts.telegram", label: "Telegram", optional: true },
      { path: "contacts.whatsapp", label: "WhatsApp", type: "tel", optional: true },
    ],
    scholarship: [
      { path: "scholarship.type", label: "Scholarship", type: "select", required: true, options: ["Presidential", "National", "Other"].map((v) => ({ value: v, label: v })) },
      { path: "scholarship.cohort", label: "Cohort (year of arrival)", type: "number", required: true },
      { path: "scholarship.level", label: "Level", type: "select", required: true, options: [["preparatory", "Preparatory"], ["bachelor", "Bachelor"], ["specialist", "Specialist"], ["master", "Master"], ["phd", "PhD"]].map(([value, label]) => ({ value, label })) },
      { path: "scholarship.reference", label: "Scholarship reference", optional: true },
      { path: "scholarship.status", label: "Scholarship status", readOnly: "Set by the scholarship department liaison" },
    ],
    studies: [
      { path: "studies.universityId", label: "University", type: "select", required: true, wide: true, options: universities.map((u) => ({ value: u.id, label: `${u.name}, ${u.city}` })) },
      { path: "studies.faculty", label: "Faculty", required: true },
      { path: "studies.programme", label: "Programme", required: true },
      { path: "studies.studentNumber", label: "Student number", required: true },
      { path: "studies.language", label: "Language of study", type: "select", required: true, options: [{ value: "Russian", label: "Russian" }, { value: "English", label: "English" }] },
      { path: "studies.stage", label: "Year of study", type: "select", required: true, options: [{ value: "preparatory", label: "Preparatory year" }, ...[1, 2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: `Year ${n}` }))] },
      { path: "studies.started", label: "Start date", type: "date", required: true },
      { path: "studies.expectedFinish", label: "Expected finish", type: "date", required: true },
      { path: "studies.academicStatus", label: "Academic status", readOnly: "Changed by a verifier after a transfer, leave, or graduation" },
    ],
    stay: [
      { path: "stay.visaNumber", label: "Visa number" },
      { path: "stay.visaType", label: "Visa type" },
      { path: "stay.visaExpiry", label: "Visa expiry", type: "date", required: true },
      { path: "stay.migrationCard", label: "Migration card number" },
      { path: "stay.migrationExpiry", label: "Migration card expiry", type: "date" },
      { path: "stay.registrationAddress", label: "Registration address", wide: true },
      { path: "stay.registrationExpiry", label: "Registration expiry", type: "date", required: true },
      { path: "stay.housing", label: "Housing", type: "select", options: [{ value: "University hostel", label: "University hostel" }, { value: "Private address", label: "Private address" }] },
      { path: "stay.insurer", label: "Insurer" },
      { path: "stay.policyNumber", label: "Policy number" },
      { path: "stay.insuranceExpiry", label: "Insurance expiry", type: "date", required: true },
    ],
    emergency: [
      { path: "emergency.kinName", label: "Next of kin, full name", required: true },
      { path: "emergency.kinRelation", label: "Relationship", required: true },
      { path: "emergency.kinPhone", label: "Next of kin, phone", type: "tel", required: true },
      { path: "emergency.kinTown", label: "Next of kin, town in Zimbabwe", required: true },
      { path: "emergency.secondName", label: "Second contact, name", optional: true },
      { path: "emergency.secondPhone", label: "Second contact, phone", type: "tel", optional: true },
      { path: "emergency.russiaContact", label: "Contact in Russia", optional: true, wide: true, hint: "A friend or classmate who can be reached quickly" },
      { path: "emergency.medical", label: "Medical notes", type: "textarea", optional: true, hint: "Allergies, conditions, or medication. Only welfare officers can see this." },
    ],
  };

  const current = sections.find((x) => x.id === active) ?? sections[0];
  const docs = currentDocs(data, s.id);

  return (
    <>
      <PageHeader
        title="My profile"
        description="Keep this current. Verifiers and the welfare office rely on it."
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const file = {
                  exportedAt: new Date().toISOString(),
                  profile: s,
                  documents: data.documents.filter((d) => d.studentId === s.id),
                  semesters: data.submissions.filter((x) => x.studentId === s.id),
                  travel: data.travel.filter((t) => t.studentId === s.id),
                  notices: data.notices.filter((n) => n.studentId === s.id),
                };
                downloadBlob(`zisar-my-file-${s.surname.toLowerCase()}.json`, JSON.stringify(file, null, 2));
                toast("Your file was downloaded as JSON", { tone: "success" });
              }}
            >
              <FileJson className="size-4" aria-hidden />
              Download my file
            </Button>
            <LinkButton href="/profile/print" size="sm">
              <Printer className="size-4" aria-hidden />
              Printable page
            </LinkButton>
          </>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto]">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="relative shrink-0">
              <Avatar name={fullName(s)} photo={s.photo} size={72} />
              <button
                type="button"
                onClick={() => photoRef.current?.click()}
                className="absolute -right-1 -bottom-1 grid size-8 place-items-center rounded-full border-2 border-surface bg-accent text-accent-contrast"
                aria-label="Change photo"
              >
                <Camera className="size-4" aria-hidden />
              </button>
              <input
                ref={photoRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const photo = await fileToDataUrl(f, 400);
                  withUndo("Photo updated", () => updateStudent(DEMO_STUDENT_ID, { photo }));
                }}
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">{pct}% of required sections complete</span>
              </div>
              <Progress value={pct} label="Profile completeness" />
              <span className="t-small text-muted">
                {sections.filter((x) => x.required && x.state !== "complete").length === 0
                  ? "Every required section is complete."
                  : `Still needed: ${sections
                      .filter((x) => x.required && x.state !== "complete")
                      .map((x) => x.title)
                      .join(", ")}`}
              </span>
            </div>
          </CardBody>
        </Card>
        <Card className="md:w-72">
          <CardBody className="flex h-full items-center gap-3">
            <ShieldCheck className="size-6 shrink-0 text-success" aria-hidden />
            <div className="flex flex-1 flex-col">
              <span className="font-medium">{s.consent ? `Consent given` : "Consent needed"}</span>
              <span className="t-small text-muted">
                {s.consent ? `Version ${s.consent.version}, ${formatDate(s.consent.date)}` : "Read and agree before we keep your file"}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setConsentOpen(true)}>
              Read
            </Button>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <nav aria-label="Profile sections" className="lg:sticky lg:top-24 lg:self-start">
          <Stepper sections={sections} active={current.id} onSelect={select} />
        </nav>

        <Card key={current.id} className="anim-fade">
          <CardHeader
            title={current.title}
            description={
              current.state === "missing" ? `Missing: ${current.missing.join(", ")}` : current.required ? "Required section" : "Optional section"
            }
            action={
              current.state === "complete" ? (
                <StatusPill status="verified" label="Complete" size="sm" />
              ) : current.state === "missing" ? (
                <StatusPill status="queried" label="Missing details" size="sm" />
              ) : undefined
            }
          />
          <CardBody className="md:pb-6">
            {FIELDS[current.id] && (
              <SectionForm
                student={s}
                fields={FIELDS[current.id]}
                onSave={save(current.title)}
                note={
                  current.id === "stay" ? (
                    <Notice tone="neutral">Expiry dates update when you upload a new visa, registration, or policy in Documents.</Notice>
                  ) : current.id === "identity" ? (
                    <Notice tone="neutral">A change to your name or passport number is checked against your passport by a verifier.</Notice>
                  ) : undefined
                }
              />
            )}

            {current.id === "academic" && (
              <div className="-mx-4 divide-y divide-border border-y border-border md:-mx-5">
                {data.windows.map((w) => {
                  const sub = submissionFor(data, w.id, s.id);
                  return (
                    <Row
                      key={w.id}
                      href={`/semesters/${w.id}`}
                      icon={GraduationCap}
                      title={w.name}
                      meta={sub ? `${OUTCOME_LABEL[sub.outcome]}${sub.decidedAt ? ` · decided ${formatDate(sub.decidedAt)}` : ""}` : "Nothing submitted"}
                      trailing={<StatusPill status={sub?.status ?? "not-started"} size="sm" />}
                    />
                  );
                })}
              </div>
            )}

            {current.id === "vault" && (
              <div className="flex flex-col gap-4">
                <p className="text-muted">
                  {docs.size} document types on file. Each keeps every version with the reviewer’s note.
                </p>
                <LinkButton href="/documents" variant="primary" className="self-start">
                  <FolderOpen className="size-4" aria-hidden />
                  Open documents
                </LinkButton>
              </div>
            )}

            {current.id === "notices" && (
              <div className="flex flex-col gap-2">
                <Switch
                  checked={s.emailAnnouncements}
                  onChange={(v) => withUndo(v ? "Announcements will also come by email" : "Announcements only in the portal", () => updateStudent(DEMO_STUDENT_ID, { emailAnnouncements: v }))}
                  label="Also send announcements by email"
                  description="Decisions on your results and documents are always emailed."
                />
                <Link href="/settings" className="t-small text-accent hover:underline">
                  More in settings
                </Link>
              </div>
            )}

            {current.id === "graduation" && (
              <div className="flex flex-col gap-4">
                <p className="text-muted">
                  In your final year, record your finish date, degree certificate, leave date, and a Zimbabwe contact. A
                  verifier confirms it, and your file is kept as an alumni record.
                </p>
                {s.graduation && (
                  <div className="flex items-center gap-2">
                    <StatusPill status={s.graduation.status === "draft" ? "draft" : s.graduation.status} />
                    <span className="t-small text-muted">Leaving {formatDate(s.graduation.leaveDate)}</span>
                  </div>
                )}
                <LinkButton href="/profile/graduation" variant="primary" className="self-start">
                  {s.graduation ? "Open graduation record" : "Start graduation record"}
                </LinkButton>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <Sheet
        open={consentOpen}
        onOpenChange={setConsentOpen}
        title="How ZISAR uses your information"
        description={s.consent ? `You agreed to version ${s.consent.version} on ${formatDate(s.consent.date)}.` : undefined}
        footer={
          <Button variant="secondary" onClick={() => setConsentOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="flex flex-col gap-3 text-[15px] leading-6">
          {CONSENT_TEXT.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="t-small text-muted">To withdraw consent, contact the welfare and scholarship liaison. Your verified results stay on the scholarship record.</p>
        </div>
      </Sheet>
    </>
  );
}
