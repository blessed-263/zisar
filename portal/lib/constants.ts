import type { City, DocType, Role } from "./types";

export const DEMO_STUDENT_ID = "st-1";
export const DEMO_APPLICANT_ID = "ap-1";
/** Demo city representative watches Moscow enquiries and edits that city's brief. */
export const REP_CITY: City = "Moscow";

export const DOC_TYPES: {
  type: DocType;
  label: string;
  expiry: boolean;
  when: string;
  required: boolean;
  masterOnly?: boolean;
}[] = [
  { type: "passport", label: "Passport bio page", expiry: true, when: "Before the first submission", required: true },
  { type: "national-id", label: "National ID", expiry: false, when: "Profile completion", required: true },
  { type: "birth-certificate", label: "Birth certificate", expiry: false, when: "When the scholarship file is assembled", required: false },
  { type: "visa", label: "Visa", expiry: true, when: "As soon as it is issued", required: true },
  { type: "migration-card", label: "Migration card", expiry: true, when: "On arrival", required: true },
  { type: "registration", label: "Registration", expiry: true, when: "On arrival, and at each renewal", required: true },
  { type: "student-card", label: "Student card", expiry: true, when: "When the university issues it", required: false },
  { type: "enrolment", label: "Enrolment confirmation", expiry: false, when: "Start of studies, and after a transfer", required: true },
  { type: "insurance", label: "Medical insurance", expiry: true, when: "On arrival", required: true },
  { type: "medical", label: "Medical certificate", expiry: true, when: "When the university or hostel requires it", required: false },
  { type: "green-card", label: "Green card", expiry: true, when: "Name to be confirmed by the committee", required: true },
  { type: "school-results", label: "O and A Level results", expiry: false, when: "Once, as the baseline academic file", required: true },
  { type: "prior-degree", label: "Prior degree and transcript", expiry: false, when: "Master and PhD students only", required: false, masterOnly: true },
  { type: "degree-certificate", label: "Degree certificate", expiry: false, when: "At the end of current studies", required: false },
];

export function docLabel(type: DocType) {
  return DOC_TYPES.find((d) => d.type === type)?.label ?? type;
}

export interface RoleMeta {
  role: Role;
  label: string;
  actor: string;
  description: string;
}

export const ROLES: RoleMeta[] = [
  { role: "student", label: "Student", actor: "Tendai Moyo", description: "Own profile, documents, semesters, voting" },
  { role: "applicant", label: "Applicant", actor: "Tariro Ndlovu", description: "Temp account in Zimbabwe — cities, news, ask a rep" },
  { role: "rep", label: "City representative", actor: "Sample name", description: "City brief and applicant enquiries for Moscow" },
  { role: "verifier", label: "Verifier", actor: "Farai Ncube", description: "Checks semester results and documents" },
  { role: "appeals", label: "Appeals officer", actor: "Nyasha Dube", description: "Reviews contested decisions" },
  { role: "welfare", label: "Welfare", actor: "Chipo Mlambo", description: "Emergency alerts and help requests" },
  { role: "coordinator", label: "Coordinator", actor: "Kudzai Marufu", description: "Moscow students, guide, mentors" },
  { role: "executive", label: "Executive", actor: "Tafadzwa Chikore", description: "Statistics, notices, committee, reports" },
  { role: "officer", label: "Election officer", actor: "Rumbidzai Hove", description: "Runs the election, never sees choices" },
];

export function roleMeta(role: Role) {
  return ROLES.find((r) => r.role === role)!;
}

export const WELFARE_OFFICERS = ["Chipo Mlambo", "Tatenda Sibanda"];
export const CITIES: City[] = ["Moscow", "Kazan", "Belgorod", "St Petersburg"];
export const COORDINATOR_CITY = "Moscow" as const;
export const COORDINATOR_UNIVERSITY = "u-rudn";

export const CONSENT_VERSION = "1.0";
export const CONSENT_TEXT = [
  "ZISAR keeps your profile, your documents, and your verified semester results so the association can support you during your studies in Russia.",
  "Inside ZISAR, only named verifiers can open your documents, and every opening is logged. Coordinators see your city details but not your medical notes or help requests.",
  "ZISAR can give the Presidential and National Scholarships Department a report on your semester status and missing documents. That report contains no passport images unless a named officer produces a special export, and that action is logged.",
  "You can download your own profile and documents at any time.",
];

export const OUTCOME_LABEL = {
  satisfactory: "Satisfactory",
  arrears: "Satisfactory with arrears",
  unsatisfactory: "Unsatisfactory",
} as const;

export const APPEAL_DAYS = 14;
