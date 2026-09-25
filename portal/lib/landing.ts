/** Public marketing copy for the landing page. Kept outside the demo store so it always renders. */

export const LANDING_ABOUT = {
  title: "Who we are",
  lead:
    "ZISAR is the Zimbabwe Students Association in Russia — the body that represents Zimbabwean students across Russian universities.",
  body: [
    "We keep members enrolled and safe: semester sheets verified, documents current, city mentors reachable, and someone to call when an emergency cannot wait for a group chat.",
    "From Moscow to Kazan, Belgorod to St Petersburg, city representatives and the executive work under one constitution, one members' roll, and one portal.",
  ],
  image: "/placeholders/auth-campus.png",
  imageAlt: "Campus buildings under a clear winter sky",
  facts: [
    { label: "Cities with representation", value: "4+" },
    { label: "Focus", value: "Welfare · Academics · Voice" },
    { label: "Members", value: "Students on scholarship & private" },
  ],
} as const;

export const LANDING_PROGRAMS = [
  {
    id: "semester",
    title: "Semester verification",
    summary:
      "Every session, members file their sheets through the portal. Named verifiers check stamp, session, and arrears — so scholarship reporting stays honest and on time.",
    image: "/placeholders/blog-semester.png",
    alt: "Desk with a stamped folder and notebook in morning light",
  },
  {
    id: "welfare",
    title: "Welfare and emergencies",
    summary:
      "Help requests and emergency alerts reach welfare officers who can call you — and your next of kin in Zimbabwe — when the hostel or the chat goes quiet.",
    image: "/placeholders/blog-community.png",
    alt: "Warm hostel kitchen table with kettle and mugs",
  },
  {
    id: "cities",
    title: "City network and applicants",
    summary:
      "City representatives publish honest briefs for people still in Zimbabwe: housing, registration, climate, and what life actually costs before you choose a campus.",
    image: "/placeholders/poster-welcome.png",
    alt: "Snowy campus path at dusk with warm dormitory windows glowing",
  },
  {
    id: "elections",
    title: "Elections and committee",
    summary:
      "Offices are contested under standing rules. Members nominate, vote, and see who serves — with minutes and the constitution filed where everyone can find them.",
    image: "/placeholders/blog-after-meeting.png",
    alt: "University hall after a meeting, chairs stacked, soft evening light",
  },
] as const;

export const LANDING_PROFILES = [
  {
    id: "p-blessing",
    name: "Blessing Chinyoka",
    role: "Final-year medicine · Kazan",
    blurb:
      "National scholarship cohort. Mentors first-years through registration week and keeps the Kazan medical group oriented before exams.",
    photo: "/placeholders/person-m1.png",
    highlight: "Mentor",
  },
  {
    id: "p-tendai",
    name: "Tendai Moyo",
    role: "General Medicine · Moscow",
    blurb:
      "Third year at RUDN. Organised the newcomers' winter kit drive and walks new arrivals through the international office on day one.",
    photo: "/placeholders/person-f1.png",
    highlight: "Community",
  },
  {
    id: "p-nyasha",
    name: "Nyasha Zvobgo",
    role: "Economics · Kazan",
    blurb:
      "Standing for Secretary General this cycle. Known for clear minutes and for getting the members' roll cleaned before every vote.",
    photo: "/placeholders/person-f3.png",
    highlight: "Governance",
  },
  {
    id: "p-vimbai",
    name: "Vimbai Sithole",
    role: "Architecture · Moscow",
    blurb:
      "Designs event posters the association actually uses, and runs the studio nights that keep architecture students from studying alone.",
    photo: "/placeholders/person-f2.png",
    highlight: "Culture",
  },
] as const;

export const LANDING_COMMITTEE_PREVIEW = [
  {
    office: "President",
    note: "Leads the executive and speaks for the association.",
    photo: "/placeholders/person-f1.png",
  },
  {
    office: "Vice President",
    note: "Deputises and leads student affairs.",
    photo: "/placeholders/person-m1.png",
  },
  {
    office: "Secretary General",
    note: "Minutes, constitution, and the members' roll.",
    photo: "/placeholders/person-f2.png",
  },
  {
    office: "Welfare liaison",
    note: "Emergencies and scholarship department contact.",
    photo: "/placeholders/person-m2.png",
  },
] as const;
