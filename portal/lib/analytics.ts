import type { City, DemoData, Student } from "./types";
import { cityOf, expiringItems, profileCompleteness, windowAppliesTo, windowStateFor } from "./selectors";

export type SemesterCounts = {
  submitted: number;
  verified: number;
  queried: number;
  overdue: number;
  rejected: number;
  notStarted: number;
  total: number;
};

export type Slice = {
  key: string;
  label: string;
  sub?: string;
  members: number;
  enrolled: number;
  profileAvg: number;
  expiring: number;
  helpOpen: number;
  alertsOpen: number;
  semester: SemesterCounts;
};

export type Oversight = {
  members: number;
  enrolled: number;
  leave: number;
  profileAvg: number;
  expiring30: number;
  helpOpen: number;
  alertsOpen: number;
  travelOpen: number;
  docsWaiting: number;
  queueWaiting: number;
  byCity: Slice[];
  byUniversity: Slice[];
  byProvince: Slice[];
  byCohort: Slice[];
  byScholarship: Slice[];
};

export function emptySemester(): SemesterCounts {
  return { submitted: 0, verified: 0, queried: 0, overdue: 0, rejected: 0, notStarted: 0, total: 0 };
}

function bumpSemester(c: SemesterCounts, key: keyof SemesterCounts) {
  c[key]++;
  c.total++;
}

function semesterKey(state: ReturnType<typeof windowStateFor>): keyof SemesterCounts {
  if (state === "submitted") return "submitted";
  if (state === "verified") return "verified";
  if (state === "queried") return "queried";
  if (state === "rejected") return "rejected";
  if (state === "overdue") return "overdue";
  return "notStarted";
}

function emptySlice(key: string, label: string, sub?: string): Slice {
  return {
    key,
    label,
    sub,
    members: 0,
    enrolled: 0,
    profileAvg: 0,
    expiring: 0,
    helpOpen: 0,
    alertsOpen: 0,
    semester: emptySemester(),
  };
}

function finalize(slices: Map<string, Slice & { _profileSum: number }>): Slice[] {
  return [...slices.values()]
    .map(({ _profileSum, ...s }) => ({
      ...s,
      profileAvg: s.members ? Math.round(_profileSum / s.members) : 0,
    }))
    .sort((a, b) => b.members - a.members || a.label.localeCompare(b.label));
}

export function buildOversight(data: DemoData, windowId?: string): Oversight {
  const w = data.windows.find((x) => x.id === windowId) ?? data.windows.find((x) => new Date(x.opens) <= new Date() && new Date() <= new Date(x.deadline)) ?? data.windows[0];

  const byCity = new Map<string, Slice & { _profileSum: number }>();
  const byUniversity = new Map<string, Slice & { _profileSum: number }>();
  const byProvince = new Map<string, Slice & { _profileSum: number }>();
  const byCohort = new Map<string, Slice & { _profileSum: number }>();
  const byScholarship = new Map<string, Slice & { _profileSum: number }>();

  let enrolled = 0;
  let leave = 0;
  let profileSum = 0;
  let expiring30 = 0;

  const helpByStudent = new Map<string, number>();
  for (const h of data.help) {
    if (h.status === "open") {
      helpByStudent.set(h.studentId, (helpByStudent.get(h.studentId) ?? 0) + 1);
    }
  }
  const alertByStudent = new Map<string, number>();
  for (const a of data.alerts) {
    if (!a.receivedAt) alertByStudent.set(a.studentId, (alertByStudent.get(a.studentId) ?? 0) + 1);
  }

  const touch = (
    map: Map<string, Slice & { _profileSum: number }>,
    key: string,
    label: string,
    sub: string | undefined,
    s: Student,
  ) => {
    let row = map.get(key);
    if (!row) {
      row = { ...emptySlice(key, label, sub), _profileSum: 0 };
      map.set(key, row);
    }
    row.members++;
    row._profileSum += profileCompleteness(s);
    if (s.studies.academicStatus === "enrolled") row.enrolled++;
    if (expiringItems(s, 30).length) row.expiring++;
    row.helpOpen += helpByStudent.get(s.id) ?? 0;
    row.alertsOpen += alertByStudent.get(s.id) ?? 0;
    if (w && windowAppliesTo(w, s)) bumpSemester(row.semester, semesterKey(windowStateFor(data, w, s)));
  };

  for (const s of data.students) {
    profileSum += profileCompleteness(s);
    if (s.studies.academicStatus === "enrolled") enrolled++;
    if (s.studies.academicStatus === "academic leave") leave++;
    if (expiringItems(s, 30).length) expiring30++;

    const city = cityOf(data, s) as City;
    const uni = data.universities.find((u) => u.id === s.studies.universityId);
    touch(byCity, city, city, undefined, s);
    touch(byUniversity, s.studies.universityId, uni?.name ?? s.studies.universityId, uni?.city, s);
    touch(byProvince, s.province, s.province, s.district, s);
    touch(byCohort, String(s.scholarship.cohort), `Cohort ${s.scholarship.cohort}`, s.scholarship.level, s);
    touch(byScholarship, s.scholarship.type, s.scholarship.type, undefined, s);
  }

  // Provinces may share district as sub incorrectly when aggregating — clear sub for province totals
  for (const row of byProvince.values()) row.sub = undefined;

  return {
    members: data.students.length,
    enrolled,
    leave,
    profileAvg: data.students.length ? Math.round(profileSum / data.students.length) : 0,
    expiring30,
    helpOpen: data.help.filter((h) => h.status === "open").length,
    alertsOpen: data.alerts.filter((a) => !a.receivedAt).length,
    travelOpen: data.travel.filter((t) => t.status === "open").length,
    docsWaiting: data.documents.filter((d) => d.status === "received").length,
    queueWaiting: data.submissions.filter((s) => s.status === "submitted").length,
    byCity: finalize(byCity),
    byUniversity: finalize(byUniversity),
    byProvince: finalize(byProvince),
    byCohort: finalize(byCohort),
    byScholarship: finalize(byScholarship),
  };
}

export function activeWindowId(data: DemoData): string | undefined {
  return (
    data.windows.find((w) => new Date(w.opens) <= new Date() && new Date() <= new Date(w.deadline))?.id ??
    data.windows[0]?.id
  );
}
