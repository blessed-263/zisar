"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useSyncExternalStore } from "react";
import type {
  Announcement,
  AssocFile,
  AuditEntry,
  BlogPost,
  CityArticle,
  CityBrief,
  CityEnquiry,
  CommitteeSeat,
  DemoData,
  DocType,
  Election,
  GraduationRecord,
  Outcome,
  PersonalNotice,
  Role,
  SemesterWindow,
  Student,
  Submission,
  TravelNotice,
  ZisarEvent,
  City,
} from "./types";
import { buildSeed } from "./seed";
import { roleMeta, DEMO_STUDENT_ID, DEMO_APPLICANT_ID, WELFARE_OFFICERS, CONSENT_VERSION, docLabel, REP_CITY } from "./constants";
import { fullName } from "./selectors";
import { receiptCode, uid } from "./utils";

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

function merge<T>(base: T, patch: DeepPartial<T>): T {
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(patch as Record<string, unknown>)) {
    const cur = out[k];
    if (v && typeof v === "object" && !Array.isArray(v) && cur && typeof cur === "object" && !Array.isArray(cur)) {
      out[k] = merge(cur, v as DeepPartial<typeof cur>);
    } else {
      out[k] = v;
    }
  }
  return out as T;
}

export interface Toast {
  id: string;
  message: string;
  tone?: "default" | "success" | "danger";
  undo?: () => void;
}

interface DemoState {
  data: DemoData;
  role: Role;
  signedIn: boolean;
  theme: "system" | "light" | "dark";
  seedVersion: number;
}

interface DemoActions {
  signIn: (role: Role) => void;
  signOut: () => void;
  setRole: (role: Role) => void;
  setTheme: (t: DemoState["theme"]) => void;
  resetDemo: () => void;
  restore: (data: DemoData) => void;

  updateStudent: (id: string, patch: DeepPartial<Student>) => void;
  giveConsent: (id: string) => void;
  completeOnboarding: (id: string) => void;
  saveGraduation: (id: string, g: Omit<GraduationRecord, "status">, send: boolean) => void;
  confirmGraduation: (id: string) => void;

  uploadDocument: (studentId: string, type: DocType, fileName: string, issued: string, expires?: string) => void;
  reviewDocument: (docId: string, decision: "verified" | "queried" | "rejected", note?: string) => void;

  saveSubmission: (
    windowId: string,
    studentId: string,
    body: { outcome: Outcome; arrears: Submission["arrears"]; fileName?: string; declared: boolean },
    submit: boolean,
  ) => void;
  replyToQuery: (subId: string, fileName: string | undefined, text: string) => void;
  reviewSubmission: (subId: string, decision: "verified" | "queried" | "rejected", reason?: string) => void;
  appeal: (subId: string, reason: string) => void;
  decideAppeal: (subId: string, decision: "upheld" | "returned", note: string) => void;
  openWindow: (w: Omit<SemesterWindow, "id">) => void;

  markNoticeRead: (id: string) => void;
  markAnnouncementRead: (id: string, studentId: string) => void;
  markAllRead: (studentId: string) => void;
  publishAnnouncement: (a: Omit<Announcement, "id" | "at" | "by" | "readBy">) => void;
  publishBlogPost: (p: Omit<BlogPost, "id" | "at" | "authorName" | "authorTitle" | "authorPhoto" | "isSample">) => void;
  publishEvent: (e: Omit<ZisarEvent, "id" | "going" | "by">) => void;
  toggleGoing: (eventId: string, studentId: string) => void;

  updateSeat: (id: string, patch: Partial<CommitteeSeat>) => void;
  uploadAssocFile: (f: Omit<AssocFile, "id" | "at" | "uploadedBy">) => void;

  nominate: (electionId: string, studentId: string, officeId: string, statement: string, proposerId: string, seconderId: string) => void;
  confirmSupporter: (electionId: string, nominationId: string, which: "proposer" | "seconder") => void;
  vetNomination: (electionId: string, nominationId: string, accept: boolean, reason?: string) => void;
  advanceElection: (electionId: string, to: Election["status"]) => void;
  castVote: (electionId: string, studentId: string, choices: Record<string, string>) => string;
  applyResultsToCommittee: (electionId: string) => void;
  createElection: (e: Pick<Election, "title" | "offices" | "quorumPct" | "nominationsClose" | "votingOpens" | "votingCloses">) => void;

  sendAlert: (studentId: string, phone: string) => string;
  markAlertReceived: (id: string) => void;
  createHelp: (studentId: string, subject: string, text: string, phone: string) => string;
  replyHelp: (id: string, text: string, fromStudent: boolean) => void;
  setHelpStatus: (id: string, status: "open" | "answered" | "closed") => void;
  logHelpOpened: (id: string) => void;
  createTravel: (t: Omit<TravelNotice, "id" | "status">) => void;
  closeTravel: (id: string) => void;

  updateGuide: (universityId: string, sections: { title: string; body: string }[]) => void;
  offerMentor: (newcomerId: string, mentorId: string) => void;
  respondMentor: (id: string, accept: boolean, contact?: string) => void;

  followCity: (applicantId: string, city: City) => void;
  unfollowCity: (applicantId: string, city: City) => void;
  updateCityBrief: (city: City, patch: Pick<CityBrief, "intro" | "good" | "bad" | "ugly">) => void;
  publishCityArticle: (a: Omit<CityArticle, "id" | "at" | "by">) => void;
  createEnquiry: (applicantId: string, city: City, subject: string, text: string) => string;
  replyEnquiry: (id: string, text: string, fromApplicant: boolean) => void;
  setEnquiryStatus: (id: string, status: CityEnquiry["status"]) => void;
}

const SEED_VERSION = 6;

function now() {
  return new Date().toISOString();
}

export const useDemo = create<DemoState & DemoActions>()(
  persist(
    (set, get) => {
      const actor = () => {
        const r = get().role;
        if (r === "student") return fullName(get().data.students.find((s) => s.id === DEMO_STUDENT_ID));
        if (r === "applicant") {
          const a = get().data.applicants.find((x) => x.id === DEMO_APPLICANT_ID);
          return a ? `${a.firstNames} ${a.surname}` : roleMeta(r).actor;
        }
        if (r === "rep") {
          const seat = get().data.committee.find((c) => c.group === "city" && c.city === REP_CITY);
          return seat?.name && !seat.isSample ? seat.name : roleMeta(r).actor;
        }
        return roleMeta(r).actor;
      };
      const mutate = (fn: (d: DemoData) => void) =>
        set((s) => {
          const data = structuredClone(s.data);
          fn(data);
          return { data };
        });
      const audit = (d: DemoData, action: string, target: string, detail?: string, roleOverride?: Role) => {
        const e: AuditEntry = { id: uid("au"), at: now(), actor: actor(), role: roleOverride ?? get().role, action, target, detail };
        d.audit.unshift(e);
      };
      const notify = (d: DemoData, n: Omit<PersonalNotice, "id" | "at" | "read">) => {
        d.notices.unshift({ ...n, id: uid("no"), at: now(), read: false });
      };
      const studentLabel = (d: DemoData, id: string) => fullName(d.students.find((s) => s.id === id));
      const applicantLabel = (d: DemoData, id: string) => {
        const a = d.applicants.find((x) => x.id === id);
        return a ? `${a.firstNames} ${a.surname}` : id;
      };
      const windowName = (d: DemoData, id: string) => d.windows.find((w) => w.id === id)?.name ?? "semester";

      return {
        data: buildSeed(),
        role: "student",
        signedIn: false,
        theme: "system",
        seedVersion: SEED_VERSION,

        signIn: (role) => set({ role, signedIn: true }),
        signOut: () => set({ signedIn: false }),
        setRole: (role) => set({ role }),
        setTheme: (theme) => set({ theme }),
        resetDemo: () => set({ data: buildSeed(), seedVersion: SEED_VERSION }),
        restore: (data) => set({ data }),

        updateStudent: (id, patch) =>
          mutate((d) => {
            const i = d.students.findIndex((s) => s.id === id);
            if (i >= 0) d.students[i] = merge(d.students[i], patch);
          }),
        giveConsent: (id) =>
          mutate((d) => {
            const s = d.students.find((x) => x.id === id);
            if (s) s.consent = { version: CONSENT_VERSION, date: now() };
            audit(d, "Gave consent", studentLabel(d, id), `Consent version ${CONSENT_VERSION}`);
          }),
        completeOnboarding: (id) =>
          mutate((d) => {
            const s = d.students.find((x) => x.id === id);
            if (s) s.onboarded = true;
          }),
        saveGraduation: (id, g, send) =>
          mutate((d) => {
            const s = d.students.find((x) => x.id === id);
            if (!s) return;
            s.graduation = { ...g, status: send ? "sent" : "draft" };
            if (send) audit(d, "Sent graduation record", studentLabel(d, id));
          }),
        confirmGraduation: (id) =>
          mutate((d) => {
            const s = d.students.find((x) => x.id === id);
            if (!s?.graduation) return;
            s.graduation.status = "confirmed";
            s.graduation.confirmedBy = actor();
            s.graduation.confirmedAt = now();
            audit(d, "Confirmed graduation record", studentLabel(d, id));
            notify(d, { studentId: id, title: "Graduation record confirmed", body: "Your graduation and return record was confirmed. Your semester history stays on file.", kind: "decision", href: "/profile/graduation" });
          }),

        uploadDocument: (studentId, type, fileName, issued, expires) =>
          mutate((d) => {
            d.documents.push({ id: uid("doc"), studentId, type, fileName, issued, expires, uploadedAt: now(), status: "received" });
            const s = d.students.find((x) => x.id === studentId);
            if (s && expires) {
              if (type === "visa") s.stay.visaExpiry = expires;
              if (type === "registration") s.stay.registrationExpiry = expires;
              if (type === "migration-card") s.stay.migrationExpiry = expires;
              if (type === "insurance") s.stay.insuranceExpiry = expires;
              if (type === "passport") s.passport.expires = expires;
            }
            audit(d, "Uploaded document", `${studentLabel(d, studentId)} · ${docLabel(type)}`, fileName);
          }),
        reviewDocument: (docId, decision, note) =>
          mutate((d) => {
            const doc = d.documents.find((x) => x.id === docId);
            if (!doc) return;
            doc.status = decision;
            doc.reviewer = actor();
            doc.note = note;
            const verb = decision === "verified" ? "Verified" : decision === "queried" ? "Queried" : "Rejected";
            audit(d, `${verb} document`, `${studentLabel(d, doc.studentId)} · ${docLabel(doc.type)}`, note);
            notify(d, {
              studentId: doc.studentId,
              title: `${docLabel(doc.type)} ${decision}`,
              body: note ? `“${note}”` : `Your ${docLabel(doc.type).toLowerCase()} was verified.`,
              kind: "decision",
              href: `/documents/${doc.type}`,
            });
          }),

        saveSubmission: (windowId, studentId, body, submit) =>
          mutate((d) => {
            let sub = d.submissions.find((x) => x.windowId === windowId && x.studentId === studentId);
            const who = studentLabel(d, studentId);
            if (!sub || sub.status === "rejected") {
              if (sub && sub.status === "rejected") {
                sub.status = "draft";
                sub.events.push({ at: now(), by: who, kind: "created", text: "Started a new submission after rejection." });
              } else {
                sub = { id: uid("sub"), windowId, studentId, status: "draft", outcome: body.outcome, arrears: [], files: [], declared: false, events: [{ at: now(), by: who, kind: "created" }] };
                d.submissions.push(sub);
              }
            }
            sub.outcome = body.outcome;
            sub.arrears = body.arrears;
            sub.declared = body.declared;
            if (body.fileName && !sub.files.some((f) => f.name === body.fileName)) sub.files.push({ name: body.fileName, at: now() });
            if (submit) {
              sub.status = "submitted";
              sub.events.push({ at: now(), by: who, kind: "submitted" });
              audit(d, "Submitted result", `${who} · ${windowName(d, windowId)}`);
            }
          }),
        replyToQuery: (subId, fileName, text) =>
          mutate((d) => {
            const sub = d.submissions.find((x) => x.id === subId);
            if (!sub) return;
            const who = studentLabel(d, sub.studentId);
            if (fileName) sub.files.push({ name: fileName, at: now() });
            sub.status = "submitted";
            sub.events.push({ at: now(), by: who, kind: "replied", text });
            audit(d, "Replied to query", `${who} · ${windowName(d, sub.windowId)}`, text);
          }),
        reviewSubmission: (subId, decision, reason) =>
          mutate((d) => {
            const sub = d.submissions.find((x) => x.id === subId);
            if (!sub) return;
            sub.status = decision;
            sub.events.push({ at: now(), by: actor(), kind: decision, text: reason });
            if (decision !== "queried") {
              sub.decidedBy = actor();
              sub.decidedAt = now();
            }
            const wn = windowName(d, sub.windowId);
            const verb = decision === "verified" ? "Verified" : decision === "queried" ? "Queried" : "Rejected";
            audit(d, `${verb} result`, `${studentLabel(d, sub.studentId)} · ${wn}`, reason);
            notify(d, {
              studentId: sub.studentId,
              title: decision === "verified" ? `${wn} verified` : decision === "queried" ? `Question about your ${wn} result` : `${wn} result rejected`,
              body:
                decision === "verified"
                  ? "This semester is closed on your profile."
                  : decision === "queried"
                    ? `“${reason}” Reply on the same submission. You do not need to start again.`
                    : `“${reason}” You can submit again while the window is open, or appeal within 14 days.`,
              kind: "decision",
              href: `/semesters/${sub.windowId}`,
            });
          }),
        appeal: (subId, reason) =>
          mutate((d) => {
            const sub = d.submissions.find((x) => x.id === subId);
            if (!sub) return;
            const who = studentLabel(d, sub.studentId);
            sub.appeal = { status: "pending", reason, submittedAt: now() };
            sub.events.push({ at: now(), by: who, kind: "appealed", text: reason });
            audit(d, "Appealed result", `${who} · ${windowName(d, sub.windowId)}`, reason);
          }),
        decideAppeal: (subId, decision, note) =>
          mutate((d) => {
            const sub = d.submissions.find((x) => x.id === subId);
            if (!sub?.appeal) return;
            sub.appeal.status = decision;
            sub.appeal.officer = actor();
            sub.appeal.note = note;
            sub.appeal.decidedAt = now();
            sub.events.push({ at: now(), by: actor(), kind: decision, text: note });
            if (decision === "returned") {
              sub.status = "submitted";
            }
            const wn = windowName(d, sub.windowId);
            audit(d, decision === "upheld" ? "Upheld decision on appeal" : "Returned result to queue on appeal", `${studentLabel(d, sub.studentId)} · ${wn}`, note);
            notify(d, {
              studentId: sub.studentId,
              title: decision === "upheld" ? `Appeal on ${wn}: decision upheld` : `Appeal on ${wn}: sent back for review`,
              body: `“${note}”`,
              kind: "decision",
              href: `/semesters/${sub.windowId}`,
            });
          }),
        openWindow: (w) =>
          mutate((d) => {
            d.windows.unshift({ ...w, id: uid("w") });
            audit(d, "Opened semester window", w.name);
            d.students.forEach((s) =>
              notify(d, { studentId: s.id, title: `${w.name} is open`, body: `Submit your results before ${new Date(w.deadline).toDateString().slice(4)}.`, kind: "system", href: "/semesters" }),
            );
          }),

        markNoticeRead: (id) =>
          mutate((d) => {
            const n = d.notices.find((x) => x.id === id);
            if (n) n.read = true;
          }),
        markAnnouncementRead: (id, studentId) =>
          mutate((d) => {
            const a = d.announcements.find((x) => x.id === id);
            if (a && !a.readBy.includes(studentId)) a.readBy.push(studentId);
          }),
        markAllRead: (studentId) =>
          mutate((d) => {
            d.notices.filter((n) => n.studentId === studentId).forEach((n) => (n.read = true));
            d.announcements.forEach((a) => {
              if (!a.readBy.includes(studentId)) a.readBy.push(studentId);
            });
          }),
        publishAnnouncement: (a) =>
          mutate((d) => {
            d.announcements.unshift({ ...a, id: uid("an"), at: now(), by: actor(), readBy: [] });
            audit(d, "Published announcement", a.title);
          }),
        publishBlogPost: (p) =>
          mutate((d) => {
            const seat = d.committee.find((c) => c.office === "Secretary General");
            d.posts.unshift({
              ...p,
              id: uid("post"),
              at: now(),
              authorName: seat?.name || "Sample name",
              authorTitle: "Secretary General",
              authorPhoto: seat?.photo,
              isSample: seat?.isSample ?? true,
            });
            audit(d, "Published blog post", p.title);
          }),
        publishEvent: (e) =>
          mutate((d) => {
            d.events.unshift({ ...e, id: uid("evt"), going: [], by: actor() });
            audit(d, "Published event", e.title);
          }),
        toggleGoing: (eventId, studentId) =>
          mutate((d) => {
            const e = d.events.find((x) => x.id === eventId);
            if (!e) return;
            e.going = e.going.includes(studentId) ? e.going.filter((x) => x !== studentId) : [...e.going, studentId];
          }),

        updateSeat: (id, patch) =>
          mutate((d) => {
            const seat = d.committee.find((x) => x.id === id);
            if (!seat) return;
            Object.assign(seat, patch, { updatedBy: actor(), updatedAt: now() });
            audit(d, "Updated committee card", seat.office, patch.name === undefined && "name" in patch ? "Marked vacant" : undefined);
          }),
        uploadAssocFile: (f) =>
          mutate((d) => {
            d.files.unshift({ ...f, id: uid("f"), at: now(), uploadedBy: actor() });
            audit(d, "Filed association document", f.title, f.fileName);
          }),

        nominate: (electionId, studentId, officeId, statement, proposerId, seconderId) =>
          mutate((d) => {
            const e = d.elections.find((x) => x.id === electionId);
            if (!e) return;
            e.nominations.push({ id: uid("nom"), studentId, officeId, statement, proposerId, seconderId, proposerConfirmed: false, seconderConfirmed: false, status: "pending" });
            audit(d, "Submitted nomination", `${studentLabel(d, studentId)} · ${e.offices.find((o) => o.id === officeId)?.name}`);
          }),
        confirmSupporter: (electionId, nominationId, which) =>
          mutate((d) => {
            const n = d.elections.find((x) => x.id === electionId)?.nominations.find((x) => x.id === nominationId);
            if (!n) return;
            if (which === "proposer") n.proposerConfirmed = true;
            else n.seconderConfirmed = true;
          }),
        vetNomination: (electionId, nominationId, accept, reason) =>
          mutate((d) => {
            const e = d.elections.find((x) => x.id === electionId);
            const n = e?.nominations.find((x) => x.id === nominationId);
            if (!e || !n) return;
            n.status = accept ? "accepted" : "declined";
            n.reason = accept ? undefined : reason;
            const office = e.offices.find((o) => o.id === n.officeId)?.name ?? "office";
            audit(d, accept ? "Accepted nomination" : "Declined nomination", `${studentLabel(d, n.studentId)} · ${office}`, reason);
            notify(d, {
              studentId: n.studentId,
              title: accept ? `Nomination for ${office} accepted` : `Nomination for ${office} declined`,
              body: accept ? "Your statement will be visible to voters when statements open." : `Reason: ${reason}`,
              kind: "election",
              href: "/elections?tab=portal",
            });
          }),
        advanceElection: (electionId, to) =>
          mutate((d) => {
            const e = d.elections.find((x) => x.id === electionId);
            if (!e) return;
            e.status = to;
            if (to === "published") e.publishedAt = now();
            audit(d, "Moved election stage", e.title, `Now: ${to}`);
            const message: Partial<Record<Election["status"], string>> = {
              nominations: "Nominations are open. Eligible members can stand for one office.",
              voting: "Voting is open. Your ballot is secret, and your receipt shows only the time you voted.",
              published: "Results are published on the elections page.",
            };
            if (message[to]) {
              d.students.forEach((s) =>
                notify(d, { studentId: s.id, title: `${e.title}: ${to === "published" ? "results" : to}`, body: message[to]!, kind: "election", href: "/elections?tab=portal" }),
              );
            }
          }),
        castVote: (electionId, studentId, choices) => {
          const code = receiptCode();
          mutate((d) => {
            const e = d.elections.find((x) => x.id === electionId);
            if (!e || e.voted.includes(studentId)) return;
            e.voted.push(studentId);
            for (const [officeId, cand] of Object.entries(choices)) {
              e.tallies[officeId] = e.tallies[officeId] ?? {};
              e.tallies[officeId][cand] = (e.tallies[officeId][cand] ?? 0) + 1;
            }
            d.receipts.push({ electionId, studentId, code, at: now() });
          });
          return code;
        },
        applyResultsToCommittee: (electionId) =>
          mutate((d) => {
            const e = d.elections.find((x) => x.id === electionId);
            if (!e) return;
            e.offices.forEach((o) => {
              const t = e.tallies[o.id] ?? {};
              const entries = Object.entries(t).filter(([k]) => k !== "abstain");
              const max = Math.max(0, ...entries.map(([, v]) => v));
              const top = entries.filter(([, v]) => v === max && max > 0);
              if (top.length !== 1) return;
              const winner = d.students.find((s) => s.id === top[0][0]);
              const seat = d.committee.find((c) => c.office === o.name);
              if (!winner || !seat) return;
              seat.name = fullName(winner);
              seat.universityId = winner.studies.universityId;
              seat.city = d.universities.find((u) => u.id === winner.studies.universityId)?.city;
              seat.isSample = false;
              seat.termStart = now().slice(0, 10);
              seat.termEnd = new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10);
              seat.updatedBy = actor();
              seat.updatedAt = now();
            });
            e.committeeUpdated = true;
            audit(d, "Confirmed winners onto committee cards", e.title);
          }),
        createElection: (e) =>
          mutate((d) => {
            d.elections.unshift({ ...e, id: uid("el"), status: "draft", officerName: roleMeta("officer").actor, scrutineerName: "Simba Gumbo", nominations: [], voted: [], tallies: {} });
            audit(d, "Drafted election", e.title);
          }),

        sendAlert: (studentId, phone) => {
          const id = uid("al");
          mutate((d) => {
            const s = d.students.find((x) => x.id === studentId);
            const city = d.universities.find((u) => u.id === s?.studies.universityId)?.city ?? "Moscow";
            d.alerts.unshift({ id, studentId, city, phone, at: now(), officers: WELFARE_OFFICERS });
            audit(d, "Sent emergency alert", `${studentLabel(d, studentId)} · ${city}`);
          });
          return id;
        },
        markAlertReceived: (id) =>
          mutate((d) => {
            const a = d.alerts.find((x) => x.id === id);
            if (!a) return;
            a.receivedBy = actor();
            a.receivedAt = now();
            audit(d, "Marked alert received", `${studentLabel(d, a.studentId)} · ${a.city}`);
            notify(d, { studentId: a.studentId, title: "Your alert was received", body: `${actor()} has your alert and will call you on ${a.phone}.`, kind: "welfare", href: "/help" });
          }),
        createHelp: (studentId, subject, text, phone) => {
          const id = uid("hr");
          mutate((d) => {
            const s = d.students.find((x) => x.id === studentId);
            const city = d.universities.find((u) => u.id === s?.studies.universityId)?.city ?? "Moscow";
            d.help.unshift({ id, studentId, city, phone, subject, status: "open", at: now(), messages: [{ by: studentLabel(d, studentId), fromStudent: true, at: now(), text }] });
          });
          return id;
        },
        replyHelp: (id, text, fromStudent) =>
          mutate((d) => {
            const h = d.help.find((x) => x.id === id);
            if (!h) return;
            h.messages.push({ by: fromStudent ? studentLabel(d, h.studentId) : actor(), fromStudent, at: now(), text });
            if (!fromStudent) {
              h.status = "answered";
              notify(d, { studentId: h.studentId, title: "Reply to your help request", body: text, kind: "welfare", href: `/help/${h.id}` });
            } else {
              h.status = "open";
            }
          }),
        setHelpStatus: (id, status) =>
          mutate((d) => {
            const h = d.help.find((x) => x.id === id);
            if (h) h.status = status;
          }),
        logHelpOpened: (id) =>
          mutate((d) => {
            const h = d.help.find((x) => x.id === id);
            if (h) audit(d, "Opened help request", `${studentLabel(d, h.studentId)} · ${h.subject}`);
          }),
        createTravel: (t) =>
          mutate((d) => {
            d.travel.unshift({ ...t, id: uid("tr"), status: "open" });
          }),
        closeTravel: (id) =>
          mutate((d) => {
            const t = d.travel.find((x) => x.id === id);
            if (t) {
              t.status = "closed";
              t.closedAt = now();
            }
          }),

        updateGuide: (universityId, sections) =>
          mutate((d) => {
            const g = d.guides.find((x) => x.universityId === universityId);
            if (!g) return;
            g.sections = sections;
            g.updatedAt = now();
            g.updatedBy = actor();
            audit(d, "Updated university guide", d.universities.find((u) => u.id === universityId)?.name ?? universityId);
          }),
        offerMentor: (newcomerId, mentorId) =>
          mutate((d) => {
            d.mentors.unshift({ id: uid("mp"), newcomerId, mentorId, status: "offered", offeredBy: actor(), at: now() });
            audit(d, "Offered mentor pairing", `${studentLabel(d, newcomerId)} with ${studentLabel(d, mentorId)}`);
            notify(d, { studentId: mentorId, title: "Would you mentor a newcomer?", body: `${actor()} asked if you would be the first person ${studentLabel(d, newcomerId)} can call.`, kind: "system", href: "/home" });
          }),
        respondMentor: (id, accept, contact) =>
          mutate((d) => {
            const m = d.mentors.find((x) => x.id === id);
            if (!m) return;
            m.status = accept ? "accepted" : "declined";
            m.contact = accept ? contact : undefined;
            if (accept) notify(d, { studentId: m.newcomerId, title: "You have a mentor", body: `${studentLabel(d, m.mentorId)} agreed to help. Contact: ${contact}`, kind: "system", href: "/home" });
          }),

        followCity: (applicantId, city) =>
          mutate((d) => {
            const a = d.applicants.find((x) => x.id === applicantId);
            if (!a || a.followedCities.includes(city)) return;
            a.followedCities = [...a.followedCities, city];
            audit(d, "Joined city region", city, applicantLabel(d, applicantId));
          }),
        unfollowCity: (applicantId, city) =>
          mutate((d) => {
            const a = d.applicants.find((x) => x.id === applicantId);
            if (!a) return;
            a.followedCities = a.followedCities.filter((c) => c !== city);
            audit(d, "Left city region", city, applicantLabel(d, applicantId));
          }),
        updateCityBrief: (city, patch) =>
          mutate((d) => {
            const b = d.cityBriefs.find((x) => x.city === city);
            if (!b) return;
            Object.assign(b, patch, { updatedAt: now(), updatedBy: actor() });
            audit(d, "Updated city brief", city);
          }),
        publishCityArticle: (a) =>
          mutate((d) => {
            d.cityArticles.unshift({ ...a, id: uid("ca"), at: now(), by: actor() });
            audit(d, "Published city article", a.title, a.city);
          }),
        createEnquiry: (applicantId, city, subject, text) => {
          const id = uid("eq");
          mutate((d) => {
            const name = applicantLabel(d, applicantId);
            d.enquiries.unshift({
              id,
              city,
              applicantId,
              subject,
              status: "open",
              at: now(),
              messages: [{ by: name, fromApplicant: true, at: now(), text }],
            });
            audit(d, "Opened city enquiry", subject, city);
          });
          return id;
        },
        replyEnquiry: (id, text, fromApplicant) =>
          mutate((d) => {
            const e = d.enquiries.find((x) => x.id === id);
            if (!e) return;
            e.messages.push({ by: actor(), fromApplicant, at: now(), text });
            if (!fromApplicant) e.status = "answered";
            else if (e.status === "answered") e.status = "open";
            audit(d, "Replied to city enquiry", e.subject, e.city);
          }),
        setEnquiryStatus: (id, status) =>
          mutate((d) => {
            const e = d.enquiries.find((x) => x.id === id);
            if (!e) return;
            e.status = status;
          }),
      };
    },
    {
      name: "zisar-demo",
      version: SEED_VERSION,
      storage: createJSONStorage(() => localStorage),
      migrate: () => ({ data: buildSeed(), role: "student", signedIn: false, theme: "system", seedVersion: SEED_VERSION }) as unknown as DemoState & DemoActions,
    },
  ),
);

/** True once localStorage has been read, so the first paint shows skeletons instead of wrong data. */
export function useHydrated() {
  return useSyncExternalStore(
    (cb) => useDemo.persist.onFinishHydration(cb),
    () => useDemo.persist.hasHydrated(),
    () => false,
  );
}

export function useCurrentStudent() {
  return useDemo((s) => s.data.students.find((x) => x.id === DEMO_STUDENT_ID)!);
}

export function useCurrentApplicant() {
  return useDemo((s) => s.data.applicants?.find((x) => x.id === DEMO_APPLICANT_ID));
}

export function useActor() {
  const role = useDemo((s) => s.role);
  const student = useCurrentStudent();
  const applicant = useCurrentApplicant();
  const seatName = useDemo((s) => s.data.committee.find((c) => c.group === "city" && c.city === REP_CITY)?.name);
  if (role === "student") return fullName(student);
  if (role === "applicant") return applicant ? `${applicant.firstNames} ${applicant.surname}` : roleMeta(role).actor;
  if (role === "rep") return seatName && seatName !== "Sample name" ? seatName : roleMeta(role).actor;
  return roleMeta(role).actor;
}

interface ToastState {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

export const useToasts = create<ToastState>((set) => ({
  toasts: [],
  push: (t) => {
    const id = uid("t");
    set((s) => ({ toasts: [...s.toasts.slice(-2), { ...t, id }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })), t.undo ? 7000 : 4500);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

export function toast(message: string, opts: Omit<Toast, "id" | "message"> = {}) {
  useToasts.getState().push({ message, ...opts });
}

/** Run a store action with an undo toast that restores the data from before it. */
export function withUndo(message: string, run: () => void) {
  const before = structuredClone(useDemo.getState().data);
  run();
  toast(message, { tone: "success", undo: () => useDemo.getState().restore(before) });
}
