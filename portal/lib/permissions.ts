import type { Role } from "./types";

export type Area =
  | "own-file"
  | "queue"
  | "review"
  | "windows"
  | "students"
  | "appeals"
  | "welfare"
  | "coordinator"
  | "announcements"
  | "blog"
  | "events-admin"
  | "committee-edit"
  | "files-edit"
  | "reports"
  | "audit"
  | "stats"
  | "election-console"
  | "graduation-confirm"
  | "regions"
  | "city-brief-edit"
  | "enquiries-rep";

interface Rule {
  roles: Role[];
  rule: string;
}

export const RULES: Record<Area, Rule> = {
  "own-file": {
    roles: ["student"],
    rule: "This is a student's own file. Staff open student files from the admin area, and only where their role allows it.",
  },
  queue: {
    roles: ["verifier"],
    rule: "Only named verifiers review semester results and documents.",
  },
  review: {
    roles: ["verifier"],
    rule: "Only named verifiers can mark a result verified, queried, or rejected. Appeals officers review contested decisions from the appeals list.",
  },
  windows: {
    roles: ["verifier", "executive"],
    rule: "Semester windows are opened by verifiers or the executive.",
  },
  students: {
    roles: ["verifier", "appeals", "coordinator"],
    rule: "Student files are open to verifiers, appeals officers, and coordinators for their own city. The executive works from totals and reports, without passport images.",
  },
  appeals: {
    roles: ["appeals"],
    rule: "Appeals go to a named appeals officer who did not make the original decision.",
  },
  welfare: {
    roles: ["welfare"],
    rule: "Emergency alerts and help requests are visible only to the named welfare officers.",
  },
  coordinator: {
    roles: ["coordinator"],
    rule: "The coordinator area is for the coordinator of that city or university.",
  },
  announcements: {
    roles: ["executive"],
    rule: "Announcements are published by the executive.",
  },
  blog: {
    roles: ["executive"],
    rule: "The association blog is published by the executive on behalf of the Secretary General.",
  },
  "events-admin": {
    roles: ["executive"],
    rule: "Events are published by the executive.",
  },
  "committee-edit": {
    roles: ["executive"],
    rule: "Only a named executive editor can change the committee cards. Every change is logged.",
  },
  "files-edit": {
    roles: ["executive"],
    rule: "The constitution, standing rules, and minutes are filed by the executive.",
  },
  reports: {
    roles: ["executive"],
    rule: "Semester reports are produced by the executive.",
  },
  audit: {
    roles: ["executive"],
    rule: "The audit log is read by the executive. Nobody can edit it.",
  },
  stats: {
    roles: ["executive"],
    rule: "Association statistics are for the executive.",
  },
  "election-console": {
    roles: ["officer"],
    rule: "Only the appointed election officer can run this election. A candidate cannot run this election, and academic verifiers do not inherit this job.",
  },
  "graduation-confirm": {
    roles: ["verifier"],
    rule: "Graduation and return records are confirmed by a verifier.",
  },
  regions: {
    roles: ["applicant", "student", "rep", "executive"],
    rule: "City regions, articles, and representative briefs are for applicants, members, and city representatives.",
  },
  "city-brief-edit": {
    roles: ["rep"],
    rule: "Only the city representative for that city can edit the good, bad, and ugly brief.",
  },
  "enquiries-rep": {
    roles: ["rep"],
    rule: "Applicant enquiries are answered by the city representative for that city.",
  },
};

export function can(role: Role, area: Area): { ok: true } | { ok: false; rule: string } {
  const r = RULES[area];
  return r.roles.includes(role) ? { ok: true } : { ok: false, rule: r.rule };
}
