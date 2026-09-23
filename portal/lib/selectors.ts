import type {
  Announcement,
  DemoData,
  DocType,
  DocumentVersion,
  Election,
  SemesterWindow,
  Student,
  Submission,
} from "./types";
import { DOC_TYPES } from "./constants";
import { daysUntil } from "./utils";

export function fullName(s?: Pick<Student, "firstNames" | "surname" | "preferredName">) {
  if (!s) return "Unknown student";
  return `${s.preferredName || s.firstNames} ${s.surname}`;
}

export function uniOf(data: DemoData, s?: Student) {
  return data.universities.find((u) => u.id === s?.studies.universityId);
}

export function cityOf(data: DemoData, s?: Student) {
  return uniOf(data, s)?.city;
}

export function stageLabel(s: Student) {
  return s.studies.stage === "preparatory" ? "Preparatory year" : `Year ${s.studies.stage}`;
}

export function windowIsOpen(w: SemesterWindow, now = new Date()) {
  return new Date(w.opens) <= now && now <= new Date(w.deadline);
}

export function windowAppliesTo(w: SemesterWindow, s: Student) {
  if (new Date(s.studies.started) > new Date(w.deadline)) return false;
  if (s.studies.academicStatus !== "enrolled") return false;
  if (w.scope === "preparatory") return s.studies.stage === "preparatory";
  if (w.scope === "degree") return s.studies.stage !== "preparatory";
  return true;
}

export function submissionFor(data: DemoData, windowId: string, studentId: string) {
  return data.submissions.find((x) => x.windowId === windowId && x.studentId === studentId);
}

export type WindowState = Submission["status"] | "not-started" | "overdue";

export function windowStateFor(data: DemoData, w: SemesterWindow, s: Student): WindowState {
  const sub = submissionFor(data, w.id, s.id);
  const passed = new Date() > new Date(w.deadline);
  if (!sub) return passed ? "overdue" : "not-started";
  if (sub.status === "draft" && passed) return "overdue";
  return sub.status;
}

export function currentDocs(data: DemoData, studentId: string) {
  const map = new Map<DocType, DocumentVersion[]>();
  data.documents
    .filter((d) => d.studentId === studentId)
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
    .forEach((d) => {
      const list = map.get(d.type) ?? [];
      list.push(d);
      map.set(d.type, list);
    });
  return map;
}

/** The current file is the newest verified one; otherwise the newest upload. */
export function currentVersion(versions?: DocumentVersion[]) {
  if (!versions || versions.length === 0) return undefined;
  return versions.find((v) => v.status === "verified") ?? versions[0];
}

export function latestVersion(versions?: DocumentVersion[]) {
  return versions?.[0];
}

export type ExpiryState = "ok" | "expiring" | "expired" | "none";
export function expiryState(iso?: string, soonDays = 30): ExpiryState {
  if (!iso) return "none";
  const n = daysUntil(iso);
  if (n < 0) return "expired";
  if (n <= soonDays) return "expiring";
  return "ok";
}

export function expiringItems(s: Student, withinDays = 60) {
  const items = [
    { key: "visa", label: "Visa", date: s.stay.visaExpiry, href: "/documents/visa" },
    { key: "registration", label: "Registration", date: s.stay.registrationExpiry, href: "/documents/registration" },
    { key: "migration-card", label: "Migration card", date: s.stay.migrationExpiry, href: "/documents/migration-card" },
    { key: "insurance", label: "Medical insurance", date: s.stay.insuranceExpiry, href: "/documents/insurance" },
    { key: "passport", label: "Passport", date: s.passport.expires, href: "/documents/passport" },
  ];
  const seen = new Set<string>();
  return items
    .filter((i) => daysUntil(i.date) <= withinDays)
    .filter((i) => {
      if (i.key === "migration-card" && i.date === s.stay.visaExpiry) {
        if (seen.has("visa-date")) return false;
      }
      if (i.key === "visa") seen.add("visa-date");
      return true;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export interface SectionStatus {
  id: string;
  title: string;
  state: "complete" | "missing" | "not-started";
  missing: string[];
  required: boolean;
}

export function profileSections(s: Student, data?: DemoData): SectionStatus[] {
  const check = (pairs: [string, unknown][]) => pairs.filter(([, v]) => !v).map(([k]) => k);
  const identityMissing = check([
    ["Photo", s.photo || true],
    ["Surname", s.surname],
    ["First names", s.firstNames],
    ["Date of birth", s.dob],
    ["National ID", s.nationalId],
    ["Passport number", s.passport.number],
    ["Passport expiry", s.passport.expires],
    ["District of origin", s.district],
  ]);
  const contactsMissing = check([
    ["Email", s.contacts.email],
    ["Russia phone", s.contacts.phoneRu || s.contacts.phoneZw],
  ]);
  const scholarshipMissing = check([
    ["Scholarship", s.scholarship.type],
    ["Cohort", s.scholarship.cohort],
  ]);
  const studiesMissing = check([
    ["University", s.studies.universityId],
    ["Programme", s.studies.programme],
    ["Student number", s.studies.studentNumber],
    ["Start date", s.studies.started],
  ]);
  const stayMissing = check([
    ["Visa expiry", s.stay.visaExpiry],
    ["Registration expiry", s.stay.registrationExpiry],
    ["Insurance expiry", s.stay.insuranceExpiry],
  ]);
  const emergencyMissing = check([
    ["Next of kin name", s.emergency.kinName],
    ["Next of kin phone", s.emergency.kinPhone],
    ["Next of kin town", s.emergency.kinTown],
  ]);
  const verified = data ? data.submissions.filter((x) => x.studentId === s.id && x.status === "verified").length : 1;
  const docs = data ? data.documents.filter((d) => d.studentId === s.id).length : 1;
  const mk = (id: string, title: string, missing: string[], required: boolean, started = true): SectionStatus => ({
    id,
    title,
    missing,
    required,
    state: !started ? "not-started" : missing.length ? "missing" : "complete",
  });
  const nearEnd = daysUntil(s.studies.expectedFinish) < 365;
  return [
    mk("identity", "Identity", identityMissing, true),
    mk("contacts", "Contacts", contactsMissing, true),
    mk("scholarship", "Scholarship", scholarshipMissing, false),
    mk("studies", "Studies", studiesMissing, true),
    mk("stay", "Stay in Russia", stayMissing, false),
    mk("emergency", "Emergency", emergencyMissing, true),
    mk("academic", "Academic history", [], false, verified > 0),
    mk("vault", "Document vault", [], false, docs > 0),
    mk("notices", "Notices", [], false),
    mk("graduation", "Graduation and return", [], false, !!s.graduation || !nearEnd),
  ];
}

export function profileCompleteness(s: Student) {
  const secs = profileSections(s);
  const fields = secs.filter((x) => x.required);
  const total = fields.length;
  const done = fields.filter((x) => x.state === "complete").length;
  return Math.round((done / total) * 100);
}

export function missingRequiredDocs(data: DemoData, s: Student) {
  const docs = currentDocs(data, s.id);
  return DOC_TYPES.filter((d) => d.required)
    .filter((d) => !(s.studies.stage === "preparatory" && (d.type === "green-card" || d.type === "student-card")))
    .filter((d) => !docs.has(d.type));
}

export function audienceMatches(data: DemoData, a: Announcement, s: Student) {
  const au = a.audience;
  switch (au.kind) {
    case "all":
      return true;
    case "city":
      return cityOf(data, s) === au.value;
    case "university":
      return s.studies.universityId === au.value;
    case "cohort":
      return String(s.scholarship.cohort) === au.value;
    case "overdue":
      return data.windows.some((w) => windowAppliesTo(w, s) && windowStateFor(data, w, s) === "overdue");
    case "expiring":
      return expiringItems(s, 60).length > 0;
  }
}

export function audienceLabel(data: DemoData, a: Pick<Announcement, "audience">) {
  const { kind, value } = a.audience;
  switch (kind) {
    case "all":
      return "All students";
    case "city":
      return value ?? "One city";
    case "university":
      return data.universities.find((u) => u.id === value)?.name ?? "One university";
    case "cohort":
      return `Cohort ${value}`;
    case "overdue":
      return "Students with overdue results";
    case "expiring":
      return "Students with expiring documents";
  }
}

export function canVote(data: DemoData, s: Student) {
  const complete = profileSections(s)
    .filter((x) => x.id === "identity" || x.id === "studies")
    .every((x) => x.state === "complete");
  return s.studies.academicStatus === "enrolled" && s.scholarship.status !== "suspended" && complete;
}

export function officesForVoter(data: DemoData, e: Election, s: Student) {
  const city = cityOf(data, s);
  return e.offices.filter((o) => !o.city || o.city === city);
}

export function eligibleVoters(data: DemoData) {
  return data.students.filter((s) => canVote(data, s));
}

export function turnout(data: DemoData, e: Election) {
  const eligible = eligibleVoters(data).length;
  return { voted: e.voted.length, eligible, pct: eligible ? Math.round((e.voted.length / eligible) * 100) : 0 };
}

export function winners(e: Election) {
  return e.offices.map((o) => {
    const t = e.tallies[o.id] ?? {};
    const entries = Object.entries(t).filter(([k]) => k !== "abstain");
    const max = Math.max(0, ...entries.map(([, v]) => v));
    const top = entries.filter(([, v]) => v === max && max > 0).map(([k]) => k);
    return { office: o, tally: t, top, tie: top.length > 1, total: Object.values(t).reduce((a, b) => a + b, 0) };
  });
}

export const ELECTION_STAGES: { status: Election["status"]; label: string; description: string }[] = [
  { status: "draft", label: "Draft", description: "Offices, dates, and quorum are set. Not visible to students." },
  { status: "nominations", label: "Nominations open", description: "Eligible students submit for one office." },
  { status: "vetting", label: "Vetting", description: "Nominations are closed. The officer accepts or declines each one." },
  { status: "statements", label: "Statements", description: "Accepted candidates are visible. Voting is not open yet." },
  { status: "voting", label: "Voting open", description: "One ballot per eligible student." },
  { status: "closed", label: "Closed", description: "Totals are calculated and not yet public." },
  { status: "published", label: "Published", description: "Turnout and winners are on the page." },
  { status: "archived", label: "Archived", description: "The election stays readable. It can no longer be edited." },
];

export function nextStage(status: Election["status"]) {
  const i = ELECTION_STAGES.findIndex((s) => s.status === status);
  return ELECTION_STAGES[i + 1]?.status;
}
