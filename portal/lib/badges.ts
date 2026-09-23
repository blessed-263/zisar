import type { DemoData } from "./types";
import type { NavItem } from "./nav";
import { DEMO_STUDENT_ID, DEMO_APPLICANT_ID, REP_CITY } from "./constants";
import { audienceMatches } from "./selectors";

export function badgeCounts(data: DemoData): Record<NonNullable<NavItem["badge"]>, number> {
  const me = data.students.find((s) => s.id === DEMO_STUDENT_ID);
  const unreadNotices = data.notices.filter((n) => n.studentId === DEMO_STUDENT_ID && !n.read).length;
  const unreadAnnouncements = me
    ? data.announcements.filter((a) => audienceMatches(data, a, me) && !a.readBy.includes(me.id)).length
    : 0;
  const active = data.elections.find((e) => e.status !== "archived" && e.status !== "draft");
  return {
    notices: unreadNotices + unreadAnnouncements,
    queue:
      data.submissions.filter((s) => s.status === "submitted").length +
      data.documents.filter((d) => d.status === "received").length,
    appeals: data.submissions.filter((s) => s.appeal?.status === "pending").length,
    welfare: data.alerts.filter((a) => !a.receivedBy).length + data.help.filter((h) => h.status === "open").length,
    nominations: active
      ? active.nominations.filter((n) => n.status === "pending" && n.proposerConfirmed && n.seconderConfirmed).length
      : 0,
    enquiries:
      data.enquiries.filter((e) => e.city === REP_CITY && e.status === "open").length +
      data.enquiries.filter((e) => e.applicantId === DEMO_APPLICANT_ID && e.status === "answered").length,
  };
}
