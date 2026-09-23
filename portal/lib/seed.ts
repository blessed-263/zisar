import type {
  AuditEntry,
  DemoData,
  DocType,
  DocumentVersion,
  Student,
  Submission,
  TimelineEvent,
  University,
} from "./types";
import { addDays } from "./utils";
import { CONSENT_VERSION } from "./constants";

const universities: University[] = [
  { id: "u-rudn", name: "Peoples' Friendship University of Russia", nameRu: "Российский университет дружбы народов", city: "Moscow" },
  { id: "u-mpu", name: "Moscow Polytechnic University", nameRu: "Московский политехнический университет", city: "Moscow" },
  { id: "u-kfu", name: "Kazan Federal University", nameRu: "Казанский федеральный университет", city: "Kazan" },
  { id: "u-bsu", name: "Belgorod State National Research University", nameRu: "Белгородский государственный национальный исследовательский университет", city: "Belgorod" },
  { id: "u-spbpu", name: "Peter the Great St Petersburg Polytechnic University", nameRu: "Санкт-Петербургский политехнический университет Петра Великого", city: "St Petersburg" },
];

interface StudentSpec {
  id: string;
  surname: string;
  firstNames: string;
  sex: "Female" | "Male";
  uni: string;
  faculty: string;
  programme: string;
  stage: "preparatory" | number;
  level: Student["scholarship"]["level"];
  cohort: number;
  started: string;
  finish: string;
  district: string;
  province: string;
  visa: number;
  registration: number;
  insurance: number;
  passport: number;
  scholarship?: Student["scholarship"]["type"];
}

const specs: StudentSpec[] = [
  { id: "st-1", surname: "Moyo", firstNames: "Tendai", sex: "Female", uni: "u-rudn", faculty: "Medical Institute", programme: "General Medicine", stage: 3, level: "specialist", cohort: 2023, started: "2023-09-01", finish: "2029-06-30", district: "Gutu", province: "Masvingo", visa: 24, registration: 70, insurance: 45, passport: 900 },
  { id: "st-2", surname: "Chikwanha", firstNames: "Rutendo", sex: "Female", uni: "u-mpu", faculty: "Faculty of Information Technology", programme: "Software Engineering", stage: 2, level: "bachelor", cohort: 2024, started: "2024-09-01", finish: "2028-06-30", district: "Murehwa", province: "Mashonaland East", visa: 210, registration: 180, insurance: 200, passport: 1300 },
  { id: "st-3", surname: "Mutasa", firstNames: "Tapiwa", sex: "Male", uni: "u-rudn", faculty: "Preparatory Faculty", programme: "Russian language and sciences", stage: "preparatory", level: "preparatory", cohort: 2026, started: "2026-09-01", finish: "2027-06-30", district: "Chipinge", province: "Manicaland", visa: 80, registration: 35, insurance: 340, passport: 2400 },
  { id: "st-4", surname: "Zvobgo", firstNames: "Nyasha", sex: "Female", uni: "u-kfu", faculty: "Institute of Management, Economics and Finance", programme: "Economics", stage: 4, level: "bachelor", cohort: 2022, started: "2022-09-01", finish: "2027-06-30", district: "Bindura", province: "Mashonaland Central", visa: 150, registration: 18, insurance: 120, passport: 700 },
  { id: "st-5", surname: "Banda", firstNames: "Kudakwashe", sex: "Male", uni: "u-kfu", faculty: "Institute of Geology and Petroleum Technologies", programme: "Petroleum Engineering", stage: 2, level: "bachelor", cohort: 2024, started: "2024-09-01", finish: "2028-06-30", district: "Hwange", province: "Matabeleland North", visa: 260, registration: 190, insurance: 55, passport: 1500 },
  { id: "st-6", surname: "Mapfumo", firstNames: "Chiedza", sex: "Female", uni: "u-bsu", faculty: "Medical Institute", programme: "Pharmacy", stage: 5, level: "specialist", cohort: 2021, started: "2021-09-01", finish: "2027-06-30", district: "Zvishavane", province: "Midlands", visa: 12, registration: 12, insurance: -3, passport: 400 },
  { id: "st-7", surname: "Nyathi", firstNames: "Takudzwa", sex: "Male", uni: "u-bsu", faculty: "Preparatory Faculty", programme: "Russian language and sciences", stage: "preparatory", level: "preparatory", cohort: 2026, started: "2026-09-01", finish: "2027-06-30", district: "Lupane", province: "Matabeleland North", visa: 90, registration: 40, insurance: 345, passport: 2500 },
  { id: "st-8", surname: "Gondo", firstNames: "Farirai", sex: "Male", uni: "u-spbpu", faculty: "Institute of Mechanical Engineering", programme: "Mechanical Engineering (master)", stage: 2, level: "master", cohort: 2025, started: "2025-09-01", finish: "2027-06-30", district: "Gwanda", province: "Matabeleland South", visa: 300, registration: 240, insurance: 280, passport: 1100 },
  { id: "st-9", surname: "Chirwa", firstNames: "Munashe", sex: "Male", uni: "u-spbpu", faculty: "Institute of Civil Engineering", programme: "Civil Engineering", stage: 1, level: "bachelor", cohort: 2025, started: "2025-09-01", finish: "2029-06-30", district: "Kariba", province: "Mashonaland West", visa: 190, registration: 160, insurance: 170, passport: 1800 },
  { id: "st-10", surname: "Mhlanga", firstNames: "Tatenda", sex: "Male", uni: "u-rudn", faculty: "Law Institute", programme: "Jurisprudence", stage: 4, level: "bachelor", cohort: 2022, started: "2022-09-01", finish: "2027-06-30", district: "Bulawayo", province: "Bulawayo", visa: 58, registration: 130, insurance: 150, passport: 50 },
  { id: "st-11", surname: "Sithole", firstNames: "Vimbai", sex: "Female", uni: "u-mpu", faculty: "Faculty of Urban Planning", programme: "Architecture", stage: 3, level: "bachelor", cohort: 2023, started: "2023-09-01", finish: "2028-06-30", district: "Marondera", province: "Mashonaland East", visa: 220, registration: 200, insurance: 29, passport: 1000 },
  { id: "st-12", surname: "Chinyoka", firstNames: "Blessing", sex: "Male", uni: "u-kfu", faculty: "Institute of Fundamental Medicine", programme: "General Medicine", stage: 6, level: "specialist", cohort: 2020, started: "2020-09-01", finish: "2027-06-30", district: "Chiredzi", province: "Masvingo", visa: 120, registration: 110, insurance: 95, passport: 600, scholarship: "National" },
];

const hostels: Record<string, string> = {
  "u-rudn": "Miklukho-Maklaya 10, block 2, Moscow",
  "u-mpu": "Bolshaya Semyonovskaya 38, Moscow",
  "u-kfu": "Kremlyovskaya 18, hostel 7, Kazan",
  "u-bsu": "Pobedy 85, hostel 4, Belgorod",
  "u-spbpu": "Polytechnicheskaya 29, St Petersburg",
};

function makeStudent(s: StudentSpec, i: number): Student {
  const uni = universities.find((u) => u.id === s.uni)!;
  const femalePhotos = ["/placeholders/person-f1.png", "/placeholders/person-f2.png", "/placeholders/person-f3.png"];
  const malePhotos = ["/placeholders/person-m1.png", "/placeholders/person-m2.png", "/placeholders/person-m1.png"];
  const photoPool = s.sex === "Female" ? femalePhotos : malePhotos;
  return {
    id: s.id,
    photo: photoPool[i % photoPool.length],
    surname: s.surname,
    firstNames: s.firstNames,
    dob: `${2006 - (typeof s.stage === "number" ? s.stage : 0) - (s.level === "master" ? 4 : 0)}-0${(i % 9) + 1}-1${i % 9}`,
    sex: s.sex,
    nationalId: `63-${(214000 + i * 7919).toString().slice(0, 6)}-${String.fromCharCode(65 + i)}-${10 + i}`,
    passport: {
      number: `FN${(482100 + i * 3313).toString()}`,
      country: "Zimbabwe",
      issued: addDays(s.passport - 3650),
      expires: addDays(s.passport),
    },
    district: s.district,
    province: s.province,
    contacts: {
      email: `${s.firstNames.toLowerCase()}.${s.surname.toLowerCase()}@example.com`,
      phoneZw: `+263 77 ${(310 + i * 17).toString().padStart(3, "0")} ${(4400 + i * 131).toString().slice(0, 4)}`,
      phoneRu: `+7 9${(10 + i * 3).toString().padStart(2, "0")} ${(200 + i * 41).toString().slice(0, 3)}-${(10 + i * 7) % 90 + 10}-${(30 + i * 11) % 90 + 10}`,
      telegram: i % 3 === 0 ? undefined : `@${s.firstNames.toLowerCase()}_${s.surname.toLowerCase()}`,
    },
    scholarship: {
      type: s.scholarship ?? "Presidential",
      cohort: s.cohort,
      level: s.level,
      status: "active",
      reference: i % 2 === 0 ? `PNS/RU/${s.cohort}/${(140 + i * 9).toString()}` : undefined,
    },
    studies: {
      universityId: s.uni,
      faculty: s.faculty,
      programme: s.programme,
      studentNumber: `${s.cohort.toString().slice(2)}${(1030 + i * 211).toString()}`,
      language: "Russian",
      stage: s.stage,
      started: s.started,
      expectedFinish: s.finish,
      academicStatus: "enrolled",
    },
    stay: {
      visaNumber: `${(3100000 + i * 70001).toString()}`,
      visaType: "Study, multiple entry",
      visaExpiry: addDays(s.visa),
      migrationCard: `4618 ${(530000 + i * 1777).toString()}`,
      migrationExpiry: addDays(s.visa),
      registrationAddress: hostels[s.uni] ?? uni.city,
      registrationExpiry: addDays(s.registration),
      housing: "University hostel",
      insurer: i % 2 === 0 ? "Ingosstrakh" : "RESO-Garantia",
      policyNumber: `DMS-${(88000 + i * 431).toString()}`,
      insuranceExpiry: addDays(s.insurance),
    },
    emergency: {
      kinName: `${["Grace", "Joseph", "Ruth", "Peter", "Mercy", "Isaac"][i % 6]} ${s.surname}`,
      kinRelation: ["Mother", "Father", "Aunt", "Brother"][i % 4],
      kinPhone: `+263 71 ${(500 + i * 23).toString().slice(0, 3)} ${(2200 + i * 97).toString().slice(0, 4)}`,
      kinTown: s.district,
      secondName: i % 2 === 0 ? `${["Anna", "Simba", "Lindiwe"][i % 3]} ${s.surname}` : undefined,
      secondPhone: i % 2 === 0 ? `+263 78 ${(600 + i * 13).toString().slice(0, 3)} ${(1100 + i * 57).toString().slice(0, 4)}` : undefined,
    },
    consent: { version: CONSENT_VERSION, date: addDays(-200 + i) },
    emailAnnouncements: true,
    onboarded: true,
  };
}

const students: Student[] = specs.map(makeStudent);

// Tendai: kin town missing so "Needs attention" has a real item to show.
students[0].emergency.kinTown = "";
students[0].contacts.telegram = "@tendai_moyo";
// Newcomers are still finishing first-time setup details.
students[2].emergency.secondName = undefined;
// Farirai is close to finishing a master's degree.
students[7].graduation = {
  expectedFinish: "2027-06-30",
  leaveDate: "2027-07-20",
  zwPhone: "+263 77 812 4410",
  zwTown: "Gwanda",
  status: "sent",
};
// Chiedza lives privately, which the coordinator list should show.
students[5].stay.housing = "Private address";
students[5].stay.registrationAddress = "Kutuzova 14, flat 22, Belgorod";

const coreDocs: DocType[] = [
  "passport",
  "national-id",
  "visa",
  "migration-card",
  "registration",
  "enrolment",
  "insurance",
  "school-results",
  "green-card",
  "student-card",
];

function expiryFor(s: Student, t: DocType): string | undefined {
  switch (t) {
    case "passport":
      return s.passport.expires;
    case "visa":
      return s.stay.visaExpiry;
    case "migration-card":
      return s.stay.migrationExpiry;
    case "registration":
      return s.stay.registrationExpiry;
    case "insurance":
      return s.stay.insuranceExpiry;
    case "student-card":
      return s.studies.expectedFinish;
    case "green-card":
      return addDays(300);
    default:
      return undefined;
  }
}

const documents: DocumentVersion[] = [];
students.forEach((s, i) => {
  coreDocs.forEach((t, j) => {
    if (s.id === "st-1" && t === "green-card") return;
    if (s.id === "st-3" && (t === "student-card" || t === "green-card")) return;
    if (s.id === "st-7" && (t === "student-card" || t === "green-card" || t === "enrolment")) return;
    let status: DocumentVersion["status"] = "verified";
    let note: string | undefined;
    if (s.id === "st-1" && t === "registration") status = "received";
    if (s.id === "st-3" && (t === "registration" || t === "insurance")) status = "received";
    if (s.id === "st-6" && t === "insurance") {
      status = "queried";
      note = "The policy shown ended last week. Please upload the renewed policy.";
    }
    if (s.id === "st-11" && t === "insurance") status = "received";
    if (s.id === "st-9" && t === "migration-card") status = "received";
    documents.push({
      id: `doc-${s.id}-${t}`,
      studentId: s.id,
      type: t,
      fileName: `${t}-${s.surname.toLowerCase()}.pdf`,
      issued: addDays(-120 - j * 20),
      expires: expiryFor(s, t),
      uploadedAt: addDays(-110 - j * 4 + (status === "received" ? 100 : 0)),
      status,
      reviewer: status === "verified" || status === "queried" ? "Farai Ncube" : undefined,
      note,
    });
    if (s.id === "st-1" && t === "visa") {
      documents.push({
        id: `doc-${s.id}-${t}-old`,
        studentId: s.id,
        type: t,
        fileName: `visa-moyo-2025.pdf`,
        issued: addDays(-500),
        expires: addDays(-140),
        uploadedAt: addDays(-480),
        status: "verified",
        reviewer: "Farai Ncube",
      });
    }
    void i;
  });
});
documents.push({
  id: "doc-st-8-degree-certificate",
  studentId: "st-8",
  type: "prior-degree",
  fileName: "bachelor-transcript-gondo.pdf",
  issued: addDays(-900),
  uploadedAt: addDays(-380),
  status: "verified",
  reviewer: "Farai Ncube",
});

const W_SPRING = "w-spring-2526";
const W_AUTUMN = "w-autumn-2627";

const windows = [
  {
    id: W_SPRING,
    name: "Spring 2025/26 session",
    scope: "all" as const,
    opens: "2026-06-01T08:00:00.000Z",
    deadline: "2026-07-15T20:59:00.000Z",
    instruction:
      "Upload the official session sheet (ведомость) or the university printout with the stamp visible. A clear phone photo is fine.",
    replyDays: 14,
  },
  {
    id: W_AUTUMN,
    name: "Autumn 2026/27 session",
    scope: "all" as const,
    opens: addDays(-14),
    deadline: "2027-01-20T20:59:00.000Z",
    instruction:
      "Upload the official sheet for the autumn session as soon as your university publishes it. Preparatory students upload the language faculty sheet.",
    poster: "/placeholders/poster-meeting.png",
    replyDays: 14,
  },
];

const V = "Farai Ncube";

function ev(kind: TimelineEvent["kind"], by: string, daysAgo: number, text?: string): TimelineEvent {
  return { kind, by, at: addDays(-daysAgo), text };
}

const submissions: Submission[] = [
  // Tendai: spring rejected recently, which she will appeal in the walkthrough.
  {
    id: "sub-st-1-spring",
    windowId: W_SPRING,
    studentId: "st-1",
    status: "rejected",
    outcome: "satisfactory",
    arrears: [],
    files: [{ name: "spring-2026-sheet-moyo.jpg", at: addDays(-80) }],
    declared: true,
    events: [
      ev("created", "Tendai Moyo", 82),
      ev("submitted", "Tendai Moyo", 80),
      ev("rejected", V, 5, "The sheet shows the Autumn 2025/26 session, not Spring 2025/26. Please upload the spring sheet."),
    ],
    decidedBy: V,
    decidedAt: addDays(-5),
  },
  {
    id: "sub-st-2-spring",
    windowId: W_SPRING,
    studentId: "st-2",
    status: "verified",
    outcome: "satisfactory",
    arrears: [],
    files: [{ name: "vedomost-chikwanha.pdf", at: addDays(-90) }],
    declared: true,
    events: [ev("created", "Rutendo Chikwanha", 91), ev("submitted", "Rutendo Chikwanha", 90), ev("verified", V, 60)],
    decidedBy: V,
    decidedAt: addDays(-60),
  },
  {
    id: "sub-st-2-autumn",
    windowId: W_AUTUMN,
    studentId: "st-2",
    status: "submitted",
    outcome: "satisfactory",
    arrears: [],
    files: [{ name: "autumn-early-exams-chikwanha.pdf", at: addDays(-2) }],
    declared: true,
    events: [ev("created", "Rutendo Chikwanha", 3), ev("submitted", "Rutendo Chikwanha", 2)],
  },
  {
    id: "sub-st-3-autumn",
    windowId: W_AUTUMN,
    studentId: "st-3",
    status: "draft",
    outcome: "satisfactory",
    arrears: [],
    files: [],
    declared: false,
    events: [ev("created", "Tapiwa Mutasa", 1)],
  },
  {
    id: "sub-st-4-spring",
    windowId: W_SPRING,
    studentId: "st-4",
    status: "verified",
    outcome: "satisfactory",
    arrears: [],
    files: [{ name: "zvobgo-spring.pdf", at: addDays(-88) }],
    declared: true,
    events: [ev("created", "Nyasha Zvobgo", 89), ev("submitted", "Nyasha Zvobgo", 88), ev("verified", V, 55)],
    decidedBy: V,
    decidedAt: addDays(-55),
  },
  {
    id: "sub-st-4-autumn",
    windowId: W_AUTUMN,
    studentId: "st-4",
    status: "queried",
    outcome: "arrears",
    arrears: [{ subject: "Econometrics", mark: "2" }],
    files: [{ name: "zvobgo-autumn-photo.jpg", at: addDays(-6) }],
    declared: true,
    events: [
      ev("created", "Nyasha Zvobgo", 7),
      ev("submitted", "Nyasha Zvobgo", 6),
      ev("queried", V, 3, "The stamp at the bottom of the sheet is cut off. Please upload a photo that shows the whole page."),
    ],
  },
  {
    id: "sub-st-5-spring",
    windowId: W_SPRING,
    studentId: "st-5",
    status: "rejected",
    outcome: "satisfactory",
    arrears: [],
    files: [{ name: "banda-spring.pdf", at: addDays(-85) }],
    declared: true,
    events: [
      ev("created", "Kudakwashe Banda", 86),
      ev("submitted", "Kudakwashe Banda", 85),
      ev("rejected", V, 10, "The sheet lists a failed subject (Descriptive geometry) that the declaration does not mention."),
      ev("appealed", "Kudakwashe Banda", 3, "The subject was retaken and passed in the June resit. The resit sheet is attached."),
    ],
    decidedBy: V,
    decidedAt: addDays(-10),
    appeal: {
      status: "pending",
      reason: "The subject was retaken and passed in the June resit. The resit sheet is attached.",
      submittedAt: addDays(-3),
    },
  },
  {
    id: "sub-st-8-spring",
    windowId: W_SPRING,
    studentId: "st-8",
    status: "verified",
    outcome: "satisfactory",
    arrears: [],
    files: [{ name: "gondo-spring.pdf", at: addDays(-92) }],
    declared: true,
    events: [ev("created", "Farirai Gondo", 93), ev("submitted", "Farirai Gondo", 92), ev("verified", V, 58)],
    decidedBy: V,
    decidedAt: addDays(-58),
  },
  {
    id: "sub-st-9-spring",
    windowId: W_SPRING,
    studentId: "st-9",
    status: "verified",
    outcome: "arrears",
    arrears: [{ subject: "Higher mathematics", mark: "2" }],
    files: [{ name: "chirwa-spring.pdf", at: addDays(-84) }],
    declared: true,
    events: [ev("created", "Munashe Chirwa", 85), ev("submitted", "Munashe Chirwa", 84), ev("verified", V, 52)],
    decidedBy: V,
    decidedAt: addDays(-52),
  },
  {
    id: "sub-st-9-autumn",
    windowId: W_AUTUMN,
    studentId: "st-9",
    status: "submitted",
    outcome: "satisfactory",
    arrears: [],
    files: [{ name: "chirwa-resit-and-autumn.pdf", at: addDays(-1) }],
    declared: true,
    events: [ev("created", "Munashe Chirwa", 1), ev("submitted", "Munashe Chirwa", 1)],
  },
  {
    id: "sub-st-10-spring",
    windowId: W_SPRING,
    studentId: "st-10",
    status: "draft",
    outcome: "satisfactory",
    arrears: [],
    files: [],
    declared: false,
    events: [ev("created", "Tatenda Mhlanga", 75)],
  },
  {
    id: "sub-st-10-autumn",
    windowId: W_AUTUMN,
    studentId: "st-10",
    status: "submitted",
    outcome: "satisfactory",
    arrears: [],
    files: [{ name: "mhlanga-autumn.pdf", at: addDays(-4) }],
    declared: true,
    events: [ev("created", "Tatenda Mhlanga", 4), ev("submitted", "Tatenda Mhlanga", 4)],
  },
  {
    id: "sub-st-11-spring",
    windowId: W_SPRING,
    studentId: "st-11",
    status: "verified",
    outcome: "satisfactory",
    arrears: [],
    files: [{ name: "sithole-spring.pdf", at: addDays(-87) }],
    declared: true,
    events: [ev("created", "Vimbai Sithole", 88), ev("submitted", "Vimbai Sithole", 87), ev("verified", V, 57)],
    decidedBy: V,
    decidedAt: addDays(-57),
  },
  {
    id: "sub-st-11-autumn",
    windowId: W_AUTUMN,
    studentId: "st-11",
    status: "rejected",
    outcome: "satisfactory",
    arrears: [],
    files: [{ name: "sithole-screenshot.png", at: addDays(-8) }],
    declared: true,
    events: [
      ev("created", "Vimbai Sithole", 9),
      ev("submitted", "Vimbai Sithole", 8),
      ev("rejected", V, 4, "This is a screenshot of the student portal with no stamp and no name. Please upload the official sheet."),
    ],
    decidedBy: V,
    decidedAt: addDays(-4),
  },
  {
    id: "sub-st-12-spring",
    windowId: W_SPRING,
    studentId: "st-12",
    status: "verified",
    outcome: "satisfactory",
    arrears: [],
    files: [{ name: "chinyoka-spring.pdf", at: addDays(-95) }],
    declared: true,
    events: [ev("created", "Blessing Chinyoka", 96), ev("submitted", "Blessing Chinyoka", 95), ev("verified", V, 61)],
    decidedBy: V,
    decidedAt: addDays(-61),
  },
  {
    id: "sub-st-12-autumn",
    windowId: W_AUTUMN,
    studentId: "st-12",
    status: "verified",
    outcome: "satisfactory",
    arrears: [],
    files: [{ name: "chinyoka-autumn-clinical.pdf", at: addDays(-10) }],
    declared: true,
    events: [ev("created", "Blessing Chinyoka", 11), ev("submitted", "Blessing Chinyoka", 10), ev("verified", V, 7)],
    decidedBy: V,
    decidedAt: addDays(-7),
  },
];

const audit: AuditEntry[] = [];
let auditN = 0;
function log(at: string, actor: string, role: AuditEntry["role"], action: string, target: string, detail?: string) {
  auditN += 1;
  audit.push({ id: `au-seed-${auditN}`, at, actor, role, action, target, detail });
}
submissions.forEach((s) => {
  const st = students.find((x) => x.id === s.studentId)!;
  const w = windows.find((x) => x.id === s.windowId)!;
  s.events.forEach((e) => {
    if (e.kind === "verified" || e.kind === "rejected" || e.kind === "queried") {
      log(e.at, e.by, "verifier", e.kind === "verified" ? "Verified result" : e.kind === "rejected" ? "Rejected result" : "Queried result", `${st.firstNames} ${st.surname} · ${w.name}`, e.text);
    }
    if (e.kind === "appealed") {
      log(e.at, e.by, "student", "Appealed result", `${st.firstNames} ${st.surname} · ${w.name}`, e.text);
    }
  });
});
documents
  .filter((d) => d.status === "verified" || d.status === "queried")
  .slice(0, 18)
  .forEach((d) => {
    const st = students.find((x) => x.id === d.studentId)!;
    log(addDays(-100 + (auditN % 40)), V, "verifier", d.status === "verified" ? "Verified document" : "Queried document", `${st.firstNames} ${st.surname} · ${d.type}`, d.note);
  });
log(addDays(-30), "Tafadzwa Chikore", "executive", "Updated committee card", "Secretary General");
log(addDays(-12), "Chipo Mlambo", "welfare", "Opened help request", "Nyasha Zvobgo · Lost student card");
log(addDays(-20), "Chipo Mlambo", "welfare", "Marked alert received", "Munashe Chirwa · St Petersburg");
audit.sort((a, b) => b.at.localeCompare(a.at));

export function buildSeed(): DemoData {
  return structuredClone<DemoData>({
    universities,
    students,
    documents,
    windows,
    submissions,
    announcements: [
      {
        id: "an-1",
        title: "General meeting on 18 October",
        body: "All members are invited to the ZISAR general meeting. The agenda covers the Autumn session deadlines, the election timetable, and a report from the welfare office. Moscow members meet at RUDN, and everyone else can join online.",
        image: "/placeholders/poster-meeting.png",
        alt: "Warm university hall prepared for a general meeting, empty chairs and a podium",
        audience: { kind: "all" },
        at: addDays(-2),
        by: "Tafadzwa Chikore",
        readBy: ["st-2", "st-4"],
      },
      {
        id: "an-2",
        title: "Kazan registration renewal week",
        body: "The international office at Kazan Federal University is renewing registrations from Monday to Friday next week. Bring your passport, migration card, and the current registration slip.",
        image: "/placeholders/poster-registration.png",
        alt: "University corridor desk for registration renewal, daylight through tall windows",
        audience: { kind: "city", value: "Kazan" },
        at: addDays(-4),
        by: "Tafadzwa Chikore",
        readBy: [],
      },
      {
        id: "an-3",
        title: "Check your medical insurance",
        body: "Several policies end this term. Check the expiry date on your policy and upload the renewed one before the old one ends. The welfare office can help if you are unsure which insurer your university accepts.",
        image: "/placeholders/poster-insurance.png",
        alt: "Quiet clinic waiting area with an insurance card on a table",
        audience: { kind: "all" },
        at: addDays(-9),
        by: "Tafadzwa Chikore",
        readBy: ["st-1", "st-2", "st-12"],
      },
    ],
    notices: [
      {
        id: "no-1",
        studentId: "st-1",
        at: addDays(-5),
        title: "Spring 2025/26 result rejected",
        body: "The sheet shows the Autumn 2025/26 session, not Spring 2025/26. Please upload the spring sheet. You can appeal within 14 days.",
        kind: "decision",
        href: `/semesters/${W_SPRING}`,
        read: false,
      },
      {
        id: "no-2",
        studentId: "st-1",
        at: addDays(-1),
        title: "Voting is open",
        body: "Voting in the ZISAR executive election 2026/27 is open. Your ballot is secret, and your receipt shows only the time you voted.",
        kind: "election",
        href: "/elections?tab=portal",
        read: false,
      },
      {
        id: "no-3",
        studentId: "st-1",
        at: addDays(-40),
        title: "Visa verified",
        body: "Your visa was verified. It expires soon, so start the renewal early.",
        kind: "decision",
        href: "/documents/visa",
        read: true,
      },
    ],
    events: [
      {
        id: "evt-1",
        title: "St Petersburg sports day",
        date: addDays(16),
        city: "St Petersburg",
        description: "Football, netball, and a braai at the Polytechnic stadium. Bring a friend from another university.",
        image: "/placeholders/poster-sports.png",
        alt: "Campus sports field in late afternoon light, ready for a sports day",
        going: ["st-8", "st-9"],
        by: "Tafadzwa Chikore",
      },
      {
        id: "evt-2",
        title: "Newcomers welcome evening",
        date: addDays(9),
        city: "All cities",
        description: "An online welcome for students who arrived this September. Meet your city mentors, and ask the questions nobody answers in the group chat.",
        image: "/placeholders/poster-welcome.png",
        alt: "Snowy campus path at dusk with warm dormitory windows glowing",
        going: ["st-3", "st-7", "st-6"],
        by: "Tafadzwa Chikore",
      },
    ],
    posts: [
      {
        id: "post-1",
        title: "What we decided at the October general meeting",
        excerpt: "Deadlines for the autumn session, the election timetable, and how the welfare office will answer help requests from now on.",
        body: [
          "Members in Moscow met at RUDN, and everyone else joined online. The minutes will be filed on the elections page within seven days. Until then, here is what you need to know.",
          "The autumn semester window stays open until 20 January. If your faculty publishes the sheet late, write to academic@zisar.example with the date on the stamp. Do not wait until the last evening.",
          "Nominations for the executive election open after the Christmas break. City representatives are elected only by members studying in that city. The standing rules are already on the portal.",
          "The welfare officers asked for one change: if you send an emergency alert, keep your phone on for at least an hour. They will call the number you give, not the group chat.",
          "Thank you to everyone who stayed to the end of the agenda. The next general meeting is planned for March.",
        ].join("\n\n"),
        cover: "/placeholders/blog-after-meeting.png",
        alt: "University hall after a meeting, chairs stacked, soft evening light",
        tag: "Association",
        at: addDays(-3),
        authorName: "Sample name",
        authorTitle: "Secretary General",
        authorPhoto: "/placeholders/person-f2.png",
        isSample: true,
      },
      {
        id: "post-2",
        title: "How to survive your first Russian winter",
        excerpt: "Boots, registration, and the small things seniors wish someone had told them in September.",
        body: [
          "If this is your first winter in Russia, three things matter more than anything else: dry feet, a working registration, and knowing who to call when something breaks.",
          "Buy boots that keep water out. Trainers fail after the first thaw. City coordinators can point you to a market near your hostel that stocks larger sizes.",
          "Check the expiry date on your registration slip before the snow starts. Renewals slow down in December. The university guides on this portal list the rooms and opening hours for each campus.",
          "When the heating fails, report it in writing to the commandant and keep a photo. The welfare office can help if the hostel does not answer within two days.",
          "You are not alone. Ask for a mentor if you do not already have one. A senior who has been through one winter is worth more than any group chat tip.",
        ].join("\n\n"),
        cover: "/placeholders/blog-winter.png",
        alt: "Snowy campus path at dusk with warm dormitory windows",
        tag: "Life in Russia",
        at: addDays(-11),
        authorName: "Sample name",
        authorTitle: "Secretary General",
        authorPhoto: "/placeholders/person-f2.png",
        isSample: true,
      },
      {
        id: "post-3",
        title: "Semester sheets: what the verifier actually checks",
        excerpt: "Five points, one stamp, and why a wrong session date is the most common reason a result comes back.",
        body: [
          "Every semester sheet goes through the same five checks. Knowing them saves you a query and a week of waiting.",
          "First, the sheet must name the session that matches the window. A spring sheet filed in the autumn window is rejected, even if the marks are perfect.",
          "Second, the dean’s stamp and signature must be clear. A phone photo of a crumpled photocopy is usually queried.",
          "Third, every subject with an arrears mark must be listed in the declaration. Leaving one out does not hide it.",
          "Fourth, your student number and full name must match your profile. If your passport spelling differs from the faculty spelling, tell the verifier in the notes.",
          "Fifth, the file must be readable without zooming. If you are unsure, ask a classmate to open it on their phone before you submit.",
          "Appeals exist for contested decisions. They do not reopen a window that you missed.",
        ].join("\n\n"),
        cover: "/placeholders/blog-semester.png",
        alt: "Desk with a stamped folder and notebook in morning light",
        tag: "Academics",
        at: addDays(-18),
        authorName: "Sample name",
        authorTitle: "Secretary General",
        authorPhoto: "/placeholders/person-f2.png",
        isSample: true,
      },
      {
        id: "post-4",
        title: "Why the association keeps asking for your next of kin",
        excerpt: "It is not bureaucracy. It is so someone can reach home when you cannot.",
        body: [
          "Every year a few students end up in hospital, or miss a return date, or lose a phone. The first question the welfare officer asks is: who do we call in Zimbabwe?",
          "Your next of kin is only visible to the welfare officers when an alert is open. Verifiers and the executive do not see it on their ordinary screens.",
          "Update the name and number when they change. A dead line helps nobody. Add a second contact in Russia if you have one: a roommate, a mentor, or a cousin.",
          "Travel notices work the same way. If you leave Russia and do not come back on the date you gave, the welfare office will try your phone, then your next of kin.",
          "Keeping that section complete is part of looking after each other. That is what the association is for.",
        ].join("\n\n"),
        cover: "/placeholders/blog-community.png",
        alt: "Warm hostel kitchen table with kettle and mugs",
        tag: "Welfare",
        at: addDays(-28),
        authorName: "Sample name",
        authorTitle: "Secretary General",
        authorPhoto: "/placeholders/person-f2.png",
        isSample: true,
      },
    ],
    committee: [
      { id: "seat-pres", office: "President", group: "executive", lead: true, name: "Sample name", photo: "/placeholders/person-f1.png", universityId: "u-rudn", city: "Moscow", termStart: "2025-10-20", termEnd: "2026-10-19", note: "Leads the executive and speaks for the association.", contact: "president@zisar.example", isSample: true, updatedBy: "Tafadzwa Chikore", updatedAt: addDays(-60) },
      { id: "seat-vp", office: "Vice President", group: "executive", lead: true, name: "Sample name", photo: "/placeholders/person-m1.png", universityId: "u-kfu", city: "Kazan", termStart: "2025-10-20", termEnd: "2026-10-19", note: "Deputises for the president and leads student affairs.", contact: "vp@zisar.example", isSample: true, updatedBy: "Tafadzwa Chikore", updatedAt: addDays(-60) },
      { id: "seat-sg", office: "Secretary General", group: "executive", name: "Sample name", photo: "/placeholders/person-f2.png", universityId: "u-mpu", city: "Moscow", termStart: "2025-10-20", termEnd: "2026-10-19", note: "Keeps minutes, the constitution, and the members' roll.", contact: "secretary@zisar.example", isSample: true, updatedBy: "Tafadzwa Chikore", updatedAt: addDays(-30) },
      { id: "seat-tr", office: "Treasurer", group: "executive", name: "Sample name", photo: "/placeholders/person-m2.png", universityId: "u-spbpu", city: "St Petersburg", termStart: "2025-10-20", termEnd: "2026-10-19", note: "Keeps the association's accounts. Does not handle scholarship money.", contact: "treasurer@zisar.example", isSample: true, updatedBy: "Tafadzwa Chikore", updatedAt: addDays(-60) },
      { id: "seat-ac", office: "Academic affairs", group: "executive", name: "Sample name", photo: "/placeholders/person-f3.png", universityId: "u-kfu", city: "Kazan", termStart: "2025-10-20", termEnd: "2026-10-19", note: "Runs semester verification with the named verifiers.", contact: "academic@zisar.example", isSample: true, updatedBy: "Tafadzwa Chikore", updatedAt: addDays(-60) },
      { id: "seat-wel", office: "Welfare and scholarship liaison", group: "executive", name: "Sample name", photo: "/placeholders/person-m1.png", universityId: "u-bsu", city: "Belgorod", termStart: "2025-10-20", termEnd: "2026-10-19", note: "Receives emergency alerts and help requests, and talks to the scholarship department.", contact: "welfare@zisar.example", isSample: true, updatedBy: "Tafadzwa Chikore", updatedAt: addDays(-60) },
      { id: "seat-info", office: "Information and publicity", group: "executive", name: "Sample name", photo: "/placeholders/person-f2.png", universityId: "u-mpu", city: "Moscow", termStart: "2025-10-20", termEnd: "2026-10-19", note: "Publishes notices, posters, and events.", contact: "info@zisar.example", isSample: true, updatedBy: "Tafadzwa Chikore", updatedAt: addDays(-60) },
      { id: "seat-msk", office: "Moscow representative", group: "city", city: "Moscow", name: "Sample name", photo: "/placeholders/person-m2.png", universityId: "u-rudn", termStart: "2025-10-20", termEnd: "2026-10-19", note: "First contact for members in Moscow.", contact: "moscow@zisar.example", isSample: true, updatedBy: "Tafadzwa Chikore", updatedAt: addDays(-60) },
      { id: "seat-kzn", office: "Kazan representative", group: "city", city: "Kazan", name: "Sample name", photo: "/placeholders/person-f1.png", universityId: "u-kfu", termStart: "2025-10-20", termEnd: "2026-10-19", note: "First contact for members in Kazan.", contact: "kazan@zisar.example", isSample: true, updatedBy: "Tafadzwa Chikore", updatedAt: addDays(-60) },
      { id: "seat-bel", office: "Belgorod representative", group: "city", city: "Belgorod", name: "Sample name", photo: "/placeholders/person-m1.png", universityId: "u-bsu", termStart: "2025-10-20", termEnd: "2026-10-19", note: "First contact for members in Belgorod.", contact: "belgorod@zisar.example", isSample: true, updatedBy: "Tafadzwa Chikore", updatedAt: addDays(-45) },
      { id: "seat-spb", office: "St Petersburg representative", group: "city", city: "St Petersburg", name: "Sample name", photo: "/placeholders/person-f3.png", universityId: "u-spbpu", termStart: "2025-10-20", termEnd: "2026-10-19", note: "First contact for members in St Petersburg.", contact: "spb@zisar.example", isSample: true, updatedBy: "Tafadzwa Chikore", updatedAt: addDays(-60) },
    ],
    files: [
      { id: "f-1", kind: "constitution", title: "ZISAR constitution", fileName: "zisar-constitution.pdf", uploadedBy: "Tafadzwa Chikore", at: addDays(-300) },
      { id: "f-2", kind: "standing-rules", title: "Standing rules for elections", fileName: "standing-rules-elections.pdf", uploadedBy: "Tafadzwa Chikore", at: addDays(-120) },
      { id: "f-3", kind: "minutes", title: "Minutes, general meeting October 2025", fileName: "minutes-agm-2025-10.pdf", uploadedBy: "Tafadzwa Chikore", at: addDays(-330) },
      { id: "f-4", kind: "minutes", title: "Minutes, general meeting March 2026", fileName: "minutes-gm-2026-03.pdf", uploadedBy: "Tafadzwa Chikore", at: addDays(-190) },
    ],
    elections: [
      {
        id: "el-2627",
        title: "ZISAR executive election 2026/27",
        status: "voting",
        offices: [
          { id: "of-pres", name: "President" },
          { id: "of-sg", name: "Secretary General" },
          { id: "of-kzn", name: "Kazan representative", city: "Kazan" },
        ],
        quorumPct: 40,
        nominationsClose: addDays(-10),
        votingOpens: addDays(-1),
        votingCloses: addDays(6),
        officerName: "Rumbidzai Hove",
        scrutineerName: "Simba Gumbo",
        nominations: [
          { id: "nom-1", studentId: "st-2", officeId: "of-pres", statement: "I will publish every committee decision within a week, and I will make sure semester verification is finished within 14 days of each deadline.", proposerId: "st-11", seconderId: "st-10", proposerConfirmed: true, seconderConfirmed: true, status: "accepted" },
          { id: "nom-2", studentId: "st-12", officeId: "of-pres", statement: "Six years in Russia taught me where students get stuck. I want a mentor for every newcomer, and a welfare officer who answers within a day.", proposerId: "st-4", seconderId: "st-5", proposerConfirmed: true, seconderConfirmed: true, status: "accepted" },
          { id: "nom-3", studentId: "st-4", officeId: "of-sg", statement: "Minutes of every general meeting on the portal within 7 days, and a constitution that members can actually find.", proposerId: "st-12", seconderId: "st-5", proposerConfirmed: true, seconderConfirmed: true, status: "accepted" },
          { id: "nom-4", studentId: "st-9", officeId: "of-sg", statement: "I will keep the members' roll current, so everyone who is eligible can vote.", proposerId: "st-8", seconderId: "st-2", proposerConfirmed: true, seconderConfirmed: true, status: "accepted" },
          { id: "nom-5", studentId: "st-5", officeId: "of-kzn", statement: "Kazan needs a registration day every term, not every year. I will organise it with the international office.", proposerId: "st-4", seconderId: "st-12", proposerConfirmed: true, seconderConfirmed: true, status: "accepted" },
          { id: "nom-6", studentId: "st-12", officeId: "of-kzn", statement: "I would like to represent Kazan as well.", proposerId: "st-5", seconderId: "st-4", proposerConfirmed: true, seconderConfirmed: true, status: "declined", reason: "Already standing for another office in this election (President)." },
        ],
        voted: ["st-2", "st-4", "st-9", "st-12"],
        tallies: {
          "of-pres": { "st-2": 2, "st-12": 2 },
          "of-sg": { "st-4": 2, "st-9": 1, abstain: 1 },
          "of-kzn": { "st-5": 2 },
        },
      },
      {
        id: "el-2526",
        title: "ZISAR executive election 2025/26",
        status: "archived",
        offices: [
          { id: "of-pres", name: "President" },
          { id: "of-sg", name: "Secretary General" },
        ],
        quorumPct: 40,
        nominationsClose: "2025-09-25T12:00:00.000Z",
        votingOpens: "2025-10-06T06:00:00.000Z",
        votingCloses: "2025-10-12T20:00:00.000Z",
        officerName: "Rumbidzai Hove",
        scrutineerName: "Simba Gumbo",
        nominations: [
          { id: "nom-a1", studentId: "st-12", officeId: "of-pres", statement: "Archived statement.", proposerId: "st-4", seconderId: "st-5", proposerConfirmed: true, seconderConfirmed: true, status: "accepted" },
          { id: "nom-a2", studentId: "st-6", officeId: "of-pres", statement: "Archived statement.", proposerId: "st-8", seconderId: "st-9", proposerConfirmed: true, seconderConfirmed: true, status: "accepted" },
          { id: "nom-a3", studentId: "st-11", officeId: "of-sg", statement: "Archived statement.", proposerId: "st-2", seconderId: "st-1", proposerConfirmed: true, seconderConfirmed: true, status: "accepted" },
        ],
        voted: ["st-1", "st-2", "st-4", "st-5", "st-6", "st-8", "st-9", "st-11", "st-12"],
        tallies: {
          "of-pres": { "st-12": 4, "st-6": 5 },
          "of-sg": { "st-11": 8, abstain: 1 },
        },
        publishedAt: "2025-10-13T10:00:00.000Z",
        committeeUpdated: true,
      },
    ],
    receipts: [
      { electionId: "el-2526", studentId: "st-1", code: "K7QM-2HXP", at: "2025-10-08T17:42:00.000Z" },
    ],
    help: [
      {
        id: "hr-1",
        studentId: "st-4",
        city: "Kazan",
        phone: students[3].contacts.phoneRu,
        subject: "Lost student card and registration slip",
        status: "open",
        at: addDays(-12),
        messages: [
          { by: "Nyasha Zvobgo", fromStudent: true, at: addDays(-12), text: "My bag was stolen on the tram with my student card and registration slip inside. The police gave me a reference number. What do I do first?" },
          { by: "Chipo Mlambo", fromStudent: false, at: addDays(-11), text: "Keep the police reference. The international office can reissue the registration slip. Take your passport and the reference to room 114. I will check with you on Friday." },
        ],
      },
    ],
    alerts: [
      {
        id: "al-1",
        studentId: "st-9",
        city: "St Petersburg",
        phone: students[8].contacts.phoneRu,
        at: addDays(-20),
        officers: ["Chipo Mlambo", "Tatenda Sibanda"],
        receivedBy: "Chipo Mlambo",
        receivedAt: addDays(-20),
      },
    ],
    travel: [
      { id: "tr-1", studentId: "st-6", leave: addDays(-40), returnDate: addDays(-5), reason: "Family emergency", reRegister: true, status: "open" },
      { id: "tr-2", studentId: "st-12", leave: addDays(-90), returnDate: addDays(-60), reason: "Holiday", reRegister: true, status: "closed", closedAt: addDays(-59) },
      { id: "tr-3", studentId: "st-2", leave: addDays(40), returnDate: addDays(60), reason: "Holiday", reRegister: true, status: "open" },
    ],
    guides: universities.map((u) => ({
      universityId: u.id,
      updatedAt: addDays(-20),
      updatedBy: u.id === "u-rudn" ? "Kudzai Marufu" : "City coordinator",
      sections: [
        {
          title: "Registration",
          body:
            u.city === "Moscow"
              ? "Registration is done through the international students' office in the main building. Hand in your passport and migration card within 3 working days of arriving, or of returning from a trip. Collect the slip after about a week."
              : `Registration at ${u.name} is handled by the international office. Bring your passport, migration card, and the hostel contract. Renew before the date on the slip, not after.`,
        },
        {
          title: "International office",
          body: "Open Monday to Friday, 10:00 to 17:00, closed for lunch 13:00 to 14:00. Queues are shortest on Tuesday mornings.",
        },
        {
          title: "Medical insurance",
          body: "The university accepts policies from its partner insurers only. Check the list before you pay for a policy elsewhere.",
        },
        {
          title: "Hostel office",
          body: "Report broken heating or locks in writing, and keep a photo of the note. The hostel office needs your student card for any contract change.",
        },
      ],
    })),
    mentors: [
      { id: "mp-1", newcomerId: "st-3", mentorId: "st-1", status: "offered", offeredBy: "Kudzai Marufu", at: addDays(-1) },
      { id: "mp-2", newcomerId: "st-7", mentorId: "st-6", status: "accepted", contact: "@chiedza_mapfumo on Telegram", offeredBy: "City coordinator", at: addDays(-15) },
    ],
    applicants: [
      {
        id: "ap-1",
        surname: "Ndlovu",
        firstNames: "Tariro",
        email: "tariro.ndlovu@example.com",
        phoneZw: "+263 77 400 1122",
        province: "Bulawayo",
        district: "Bulawayo",
        followedCities: ["Moscow", "Kazan"],
        expiresAt: addDays(90),
        createdAt: addDays(-12),
      },
      {
        id: "ap-2",
        surname: "Moyo",
        firstNames: "Anesu",
        email: "anesu.moyo@example.com",
        phoneZw: "+263 71 555 0199",
        province: "Harare",
        district: "Harare",
        followedCities: ["St Petersburg"],
        expiresAt: addDays(60),
        createdAt: addDays(-5),
      },
    ],
    cityBriefs: [
      {
        city: "Moscow",
        seatId: "seat-msk",
        intro: "Moscow is the main hub for Zimbabwean students in Russia. Most Presidential placements land here first.",
        good: "Huge Zimbabwean network, more English speakers than anywhere else, and every embassy or scholarship errand is in one city. Hostels at RUDN and the polytechnic are used to foreign students. You can find Zimbabwean groceries if you know where to ask.",
        bad: "Rents and food cost more than in the regions. Metro rides add up. Registration queues at the big universities can eat a whole morning, and winter black ice on the ring roads is no joke if you are used to Bulawayo heat.",
        ugly: "Scam “helpers” outside migration offices. Overcrowded hostel rooms in the first weeks. Loneliness hits hard if you do not join a city group early — the city is so big you can study for a year without meeting another Zimbabwean unless you look.",
        updatedAt: addDays(-8),
        updatedBy: "Sample name",
      },
      {
        city: "Kazan",
        seatId: "seat-kzn",
        intro: "Kazan is smaller, organised, and popular with engineering and medicine students.",
        good: "Walkable centre, strong university support for internationals, and a tight Zimbabwean group that actually meets. Winters are cold but the city is easier to learn than Moscow. Shared taxis and buses are cheap once you know the routes.",
        bad: "Fewer flights home. English is thinner outside the campus. If your programme is only offered in Russian, the preparatory year is non-negotiable and the first months are exhausting.",
        ugly: "Registration slips expire faster than you expect — miss the date and you spend a week fixing it. Some private landlords will not take foreigners. Racism on late-night buses happens; travel in pairs after dark when you can.",
        updatedAt: addDays(-14),
        updatedBy: "Sample name",
      },
      {
        city: "Belgorod",
        seatId: "seat-bel",
        intro: "Belgorod is quiet and study-focused. Many medical and pharmacy students are placed here.",
        good: "Lower cost of living, closer lecturers, and a campus that feels manageable. The Zimbabwean group is small enough that everyone knows each other. Hostels are usually nearer the faculties.",
        bad: "Very little nightlife or English. Getting a specialist doctor or a passport appointment often means a trip to Moscow. News from home arrives slower when the group chat is quiet.",
        ugly: "Border-region alerts and travel restrictions can change with little notice — always check with the welfare office before you book a trip. Isolation is real if your cohort is tiny. Some students feel stuck until the first summer break.",
        updatedAt: addDays(-20),
        updatedBy: "Sample name",
      },
      {
        city: "St Petersburg",
        seatId: "seat-spb",
        intro: "St Petersburg suits students who want culture and a coastal feel, with strong engineering schools.",
        good: "Beautiful city, good public transport, and a growing Zimbabwean circle around the polytechnic. Summers are long and light. Museums and parks make weekends feel less like survival mode.",
        bad: "Damp winters that feel colder than the thermometer. Flat hunts take time. Russian bureaucracy here is polite but slow — budget extra days for any stamp.",
        ugly: "Flooding in low areas after heavy rain. Tourist scams near Nevsky. First-year loneliness in big hostels if you arrive mid-term when cliques are already set.",
        updatedAt: addDays(-11),
        updatedBy: "Sample name",
      },
    ],
    cityArticles: [
      {
        id: "ca-1",
        city: "Moscow",
        title: "What to pack before you fly into Sheremetyevo",
        excerpt: "A short list from students who landed this September — what they wish they had brought, and what they shipped for nothing.",
        body: [
          "Bring a warm coat you already own. Moscow shops sell coats, but sizes and prices in the first week are painful when you are jet-lagged.",
          "Pack digital and paper copies of your invitation, passport, and scholarship letter in separate bags. Phone battery dies in the queue.",
          "Leave the rice cooker. Buy one here with a Russian plug. Bring a few packets of sadza meal if you want comfort food in week one — your roommate will thank you.",
        ].join("\n\n"),
        cover: "/placeholders/blog-winter.png",
        at: addDays(-6),
        by: "Moscow representative",
      },
      {
        id: "ca-2",
        city: "Moscow",
        title: "Registration week: who to ask, and who to ignore",
        excerpt: "The international office is your friend. The person with a laminated badge outside the gate is not.",
        body: [
          "Go straight to the international students’ desk listed in your university guide on this portal. Do not pay anyone in the street to “fast-track” your slip.",
          "Photograph every page they stamp. If the slip has a short expiry, set two phone reminders a week before.",
          "Join the Moscow ZISAR chat before you land. Someone who registered last month will tell you which window is open on your day.",
        ].join("\n\n"),
        cover: "/placeholders/blog-semester.png",
        at: addDays(-18),
        by: "Moscow representative",
      },
      {
        id: "ca-3",
        city: "Kazan",
        title: "First month in Kazan without burning your stipend",
        excerpt: "Markets, canteens, and when a shared taxi is cheaper than the metro habit you brought from home.",
        body: [
          "Eat on campus for the first two weeks while you learn prices. Off-campus cafés near Bauman look cheap until you convert the bill.",
          "Buy a local SIM the day you arrive — the representative’s office hours post has the kiosk that still accepts foreign passports.",
          "Winter boots matter more than a second pair of jeans. Wet feet in November will cost you more in medicine than the boots.",
        ].join("\n\n"),
        cover: "/placeholders/blog-community.png",
        at: addDays(-9),
        by: "Kazan representative",
      },
      {
        id: "ca-4",
        city: "Belgorod",
        title: "Studying medicine in a small city",
        excerpt: "What the quiet is good for, and when you should plan a Moscow trip for paperwork.",
        body: [
          "Belgorod rewards students who like a routine. Libraries are less crowded. Your lecturers will learn your name.",
          "For passport renewals and some medical panels, budget a Moscow trip with overnight stay. Do it in a group — the welfare office can tip you about safe dates.",
          "Keep your next of kin details current. When the campus is small, news travels fast, and the representative needs a working Zimbabwe number.",
        ].join("\n\n"),
        cover: "/placeholders/blog-after-meeting.png",
        at: addDays(-22),
        by: "Belgorod representative",
      },
      {
        id: "ca-5",
        city: "St Petersburg",
        title: "White nights and dark mornings",
        excerpt: "How the light changes your sleep, your studies, and your mood in the first year.",
        body: [
          "Buy blackout curtains or an eye mask before June. The light at 1 a.m. will wreck your exam prep if you pretend it does not matter.",
          "In December, force daylight walks — even twenty minutes. The group chat often meets for Sunday coffee near the metro so nobody turns into a ghost.",
          "Learn one winter route from hostel to faculty in daylight, then use it in the dark. Getting lost at −15 °C is how small problems become emergencies.",
        ].join("\n\n"),
        cover: "/placeholders/auth-campus.png",
        at: addDays(-4),
        by: "St Petersburg representative",
      },
    ],
    enquiries: [
      {
        id: "eq-1",
        city: "Moscow",
        applicantId: "ap-1",
        subject: "Hostel vs private flat for year one",
        status: "answered",
        at: addDays(-3),
        messages: [
          {
            by: "Tariro Ndlovu",
            fromApplicant: true,
            at: addDays(-3),
            text: "I have an offer for RUDN medicine. Should I take the hostel first, or look for a flat with two other girls from Harare?",
          },
          {
            by: "Sample name",
            fromApplicant: false,
            at: addDays(-2),
            text: "Hostel for the first semester. You need the registration address tied to the university, and you will meet people who already know the system. Look for a flat after you have a slip and a roommate you trust.",
          },
        ],
      },
      {
        id: "eq-2",
        city: "Kazan",
        applicantId: "ap-1",
        subject: "Is Kazan realistic if my Russian is weak?",
        status: "open",
        at: addDays(-1),
        messages: [
          {
            by: "Tariro Ndlovu",
            fromApplicant: true,
            at: addDays(-1),
            text: "I am considering Kazan Federal for petroleum. My Russian is only school level. Will the preparatory year be enough, or should I push for Moscow?",
          },
        ],
      },
    ],
    audit,
  });
}

export const WINDOW_IDS = { spring: W_SPRING, autumn: W_AUTUMN };
