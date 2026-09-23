export type Role =
  | "student"
  | "verifier"
  | "appeals"
  | "welfare"
  | "coordinator"
  | "executive"
  | "officer"
  | "applicant"
  | "rep";

export type City = "Moscow" | "Kazan" | "Belgorod" | "St Petersburg";

export interface University {
  id: string;
  name: string;
  nameRu: string;
  city: City;
}

export type ScholarshipType = "Presidential" | "National" | "Other";
export type Level = "preparatory" | "bachelor" | "specialist" | "master" | "phd";
export type ScholarshipStatus = "active" | "academic leave" | "suspended" | "completed" | "withdrawn";
export type AcademicStatus = "enrolled" | "academic leave" | "transferred" | "graduated" | "withdrawn";

export interface Student {
  id: string;
  photo?: string;
  surname: string;
  firstNames: string;
  preferredName?: string;
  dob: string;
  sex: "Female" | "Male";
  nationalId: string;
  passport: { number: string; country: string; issued: string; expires: string };
  district: string;
  province: string;
  contacts: { email: string; phoneZw: string; phoneRu: string; telegram?: string; whatsapp?: string };
  scholarship: { type: ScholarshipType; cohort: number; level: Level; status: ScholarshipStatus; reference?: string };
  studies: {
    universityId: string;
    faculty: string;
    programme: string;
    studentNumber: string;
    language: "Russian" | "English";
    stage: "preparatory" | number;
    started: string;
    expectedFinish: string;
    academicStatus: AcademicStatus;
  };
  stay: {
    visaNumber: string;
    visaType: string;
    visaExpiry: string;
    migrationCard: string;
    migrationExpiry: string;
    registrationAddress: string;
    registrationExpiry: string;
    housing: "University hostel" | "Private address";
    insurer: string;
    policyNumber: string;
    insuranceExpiry: string;
  };
  emergency: {
    kinName: string;
    kinRelation: string;
    kinPhone: string;
    kinTown: string;
    secondName?: string;
    secondPhone?: string;
    russiaContact?: string;
    medical?: string;
  };
  consent: { version: string; date: string } | null;
  graduation?: GraduationRecord;
  emailAnnouncements: boolean;
  onboarded: boolean;
}

export interface GraduationRecord {
  expectedFinish: string;
  certificateFile?: string;
  leaveDate: string;
  zwPhone: string;
  zwTown: string;
  status: "draft" | "sent" | "confirmed";
  confirmedBy?: string;
  confirmedAt?: string;
}

export type DocType =
  | "passport"
  | "national-id"
  | "birth-certificate"
  | "visa"
  | "migration-card"
  | "registration"
  | "student-card"
  | "enrolment"
  | "insurance"
  | "medical"
  | "green-card"
  | "school-results"
  | "prior-degree"
  | "degree-certificate";

export type ReviewStatus = "received" | "verified" | "queried" | "rejected";

export interface DocumentVersion {
  id: string;
  studentId: string;
  type: DocType;
  fileName: string;
  issued: string;
  expires?: string;
  uploadedAt: string;
  status: ReviewStatus;
  reviewer?: string;
  note?: string;
}

export interface SemesterWindow {
  id: string;
  name: string;
  scope: "all" | "preparatory" | "degree";
  opens: string;
  deadline: string;
  instruction: string;
  poster?: string;
  replyDays: number;
}

export type SubmissionStatus = "draft" | "submitted" | "verified" | "queried" | "rejected";
export type Outcome = "satisfactory" | "arrears" | "unsatisfactory";

export interface TimelineEvent {
  at: string;
  by: string;
  kind: "created" | "submitted" | "queried" | "replied" | "verified" | "rejected" | "appealed" | "upheld" | "returned";
  text?: string;
}

export interface Appeal {
  status: "pending" | "upheld" | "returned";
  reason: string;
  submittedAt: string;
  officer?: string;
  note?: string;
  decidedAt?: string;
}

export interface Submission {
  id: string;
  windowId: string;
  studentId: string;
  status: SubmissionStatus;
  outcome: Outcome;
  arrears: { subject: string; mark?: string }[];
  files: { name: string; at: string }[];
  declared: boolean;
  events: TimelineEvent[];
  decidedBy?: string;
  decidedAt?: string;
  appeal?: Appeal;
}

export type AudienceKind = "all" | "city" | "university" | "cohort" | "overdue" | "expiring";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  image?: string;
  alt?: string;
  audience: { kind: AudienceKind; value?: string };
  at: string;
  by: string;
  readBy: string[];
}

export interface PersonalNotice {
  id: string;
  studentId: string;
  at: string;
  title: string;
  body: string;
  kind: "decision" | "election" | "welfare" | "system";
  href?: string;
  read: boolean;
}

export interface ZisarEvent {
  id: string;
  title: string;
  date: string;
  city: City | "All cities";
  description: string;
  image?: string;
  alt?: string;
  going: string[];
  by: string;
}

/** Long-form news from the Secretary General. Separate from short announcements. */
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  /** Paragraphs separated by blank lines. */
  body: string;
  cover?: string;
  alt?: string;
  tag: string;
  at: string;
  authorName: string;
  authorTitle: string;
  authorPhoto?: string;
  isSample: boolean;
}

export interface CommitteeSeat {
  id: string;
  office: string;
  group: "executive" | "city";
  lead?: boolean;
  name?: string;
  photo?: string;
  universityId?: string;
  city?: City;
  termStart?: string;
  termEnd?: string;
  note: string;
  contact: string;
  isSample: boolean;
  updatedBy: string;
  updatedAt: string;
}

export interface AssocFile {
  id: string;
  kind: "constitution" | "standing-rules" | "minutes";
  title: string;
  fileName: string;
  uploadedBy: string;
  at: string;
}

export type ElectionStatus =
  | "draft"
  | "nominations"
  | "vetting"
  | "statements"
  | "voting"
  | "closed"
  | "published"
  | "archived";

export interface Office {
  id: string;
  name: string;
  city?: City;
}

export interface Nomination {
  id: string;
  studentId: string;
  officeId: string;
  statement: string;
  proposerId: string;
  seconderId: string;
  proposerConfirmed: boolean;
  seconderConfirmed: boolean;
  status: "pending" | "accepted" | "declined";
  reason?: string;
}

export interface Election {
  id: string;
  title: string;
  status: ElectionStatus;
  offices: Office[];
  quorumPct: number;
  nominationsClose: string;
  votingOpens: string;
  votingCloses: string;
  officerName: string;
  scrutineerName: string;
  nominations: Nomination[];
  /** Voter roll: who has voted. Never linked to a choice. */
  voted: string[];
  /** Anonymous totals: officeId -> candidate studentId or "abstain" -> count. */
  tallies: Record<string, Record<string, number>>;
  publishedAt?: string;
  committeeUpdated?: boolean;
}

export interface VoteReceipt {
  electionId: string;
  studentId: string;
  code: string;
  at: string;
}

export interface HelpRequest {
  id: string;
  studentId: string;
  city: City;
  phone: string;
  subject: string;
  status: "open" | "answered" | "closed";
  messages: { by: string; fromStudent: boolean; at: string; text: string }[];
  at: string;
}

export interface EmergencyAlert {
  id: string;
  studentId: string;
  city: City;
  phone: string;
  at: string;
  officers: string[];
  receivedBy?: string;
  receivedAt?: string;
}

export interface TravelNotice {
  id: string;
  studentId: string;
  leave: string;
  returnDate: string;
  reason: "Holiday" | "Family emergency" | "End of studies" | "Other";
  reRegister: boolean;
  status: "open" | "closed";
  closedAt?: string;
}

export interface Guide {
  universityId: string;
  sections: { title: string; body: string }[];
  updatedAt: string;
  updatedBy: string;
}

export interface MentorPair {
  id: string;
  newcomerId: string;
  mentorId: string;
  status: "offered" | "accepted" | "declined";
  contact?: string;
  offeredBy: string;
  at: string;
}

/** Temporary account for a scholarship applicant still in Zimbabwe. */
export interface Applicant {
  id: string;
  surname: string;
  firstNames: string;
  email: string;
  phoneZw: string;
  province: string;
  district: string;
  /** Cities the applicant has joined to follow news and the rep. */
  followedCities: City[];
  /** Temp access ends on this date. */
  expiresAt: string;
  createdAt: string;
}

/** Honest city brief written by the city representative. */
export interface CityBrief {
  city: City;
  seatId: string;
  intro: string;
  good: string;
  bad: string;
  ugly: string;
  updatedAt: string;
  updatedBy: string;
}

/** News and tips about life in one Russian city, for applicants and members. */
export interface CityArticle {
  id: string;
  city: City;
  title: string;
  excerpt: string;
  body: string;
  cover?: string;
  at: string;
  by: string;
}

/** Applicant asking a city representative about that city. */
export interface CityEnquiry {
  id: string;
  city: City;
  applicantId: string;
  subject: string;
  status: "open" | "answered" | "closed";
  at: string;
  messages: { by: string; fromApplicant: boolean; at: string; text: string }[];
}

export interface AuditEntry {
  id: string;
  at: string;
  actor: string;
  role: Role;
  action: string;
  target: string;
  detail?: string;
}

export interface DemoData {
  universities: University[];
  students: Student[];
  documents: DocumentVersion[];
  windows: SemesterWindow[];
  submissions: Submission[];
  announcements: Announcement[];
  notices: PersonalNotice[];
  events: ZisarEvent[];
  posts: BlogPost[];
  committee: CommitteeSeat[];
  files: AssocFile[];
  elections: Election[];
  receipts: VoteReceipt[];
  help: HelpRequest[];
  alerts: EmergencyAlert[];
  travel: TravelNotice[];
  guides: Guide[];
  mentors: MentorPair[];
  applicants: Applicant[];
  cityBriefs: CityBrief[];
  cityArticles: CityArticle[];
  enquiries: CityEnquiry[];
  audit: AuditEntry[];
}
