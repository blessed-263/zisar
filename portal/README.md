# ZISAR student portal: clickable prototype

A working prototype of the portal described in `../ZISAR-Student-Portal-Proposal.md`. It covers student records, semester verification, notices with posters, elections, and member services. Every name and document is sample data.

## Run it

```bash
cd portal
npm install
npm run dev
```

Then open http://localhost:3000 for the landing page, or http://localhost:3000/sign-in to enter a role. The **Demo** switcher in the top bar changes role at any time.

Other commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npx prisma validate` | Checks the PostgreSQL schema in `prisma/schema.prisma` |

It can be deployed to Vercel as is, so the committee can open a link.

## How the demo keeps data

Everything is saved in the viewer's own browser (localStorage key `zisar-demo`). On one laptop, a vote cast as Student shows up for the Election officer. Two people on two phones will not see each other's actions. **Settings → Reset demo** restores the sample data.

The next step, when the committee wants to try it together, is a shared PostgreSQL database behind the same store actions. The schema for that is already in `prisma/schema.prisma` and mirrors `lib/types.ts`.

## Screens and the proposal

| Proposal section | Screens |
| --- | --- |
| 5.1 and 6, the student record and profile | `/profile` (ten sections as a stepper), `/profile/print`, `/profile/graduation`, `/welcome` (consent, photo, required sections) |
| 5.2 and 8, documents and expiry | `/documents`, `/documents/[type]` (versions, upload, reviewer note), expiry warnings on `/home` |
| 5.3 and 7, semester verification | Student: `/semesters`, `/semesters/[id]`. Verifier: `/admin/queue`, `/admin/review/[id]`, `/admin/documents/[id]`, `/admin/semesters`, `/admin/students/[id]` |
| 7.5, appeal | Student appeal sheet on `/semesters/[id]`, appeals officer `/admin/appeals` |
| 7.6, semester report | `/admin/reports` (prints to A4) |
| 5.4 and 9, notices with images | `/notices`, `/notices/[id]`, composer `/admin/announcements`, `/events`, `/admin/events` |
| Secretary General blog | `/blog`, `/blog/[id]`, composer `/admin/blog` |
| 5.5, administration | Executive statistics on `/home`, `/admin/audit`, `/admin/students` |
| 10.1, elections overview | `/elections` (Overview tab), files `/admin/files` |
| 10.2, current committee | `/elections?tab=committee`, editor `/admin/committee` |
| 10.3, election portal | `/elections?tab=portal` (nominations, supporter confirmations, ballot, receipt, results), officer console `/admin/elections` |
| 11.1 and 11.2, help and emergency alert | `/help`, `/help/[id]`, the floating "I need help now" button, welfare console `/admin/welfare` |
| 11.3, travel notice | `/travel`, travel tab of `/admin/welfare` |
| 11.4 and 11.5, guides and a person to call | `/guides`, `/guides/[uni]`, `/admin/coordinator`, `/admin/coordinator/guide`, `/admin/coordinator/mentors` |
| 12, what each person sees | `/home` switches by role |
| 13, security | `lib/permissions.ts`; a blocked page names the rule. Ballots are never linked to voters and never appear in the audit log |

## Code map

```
app/(auth)/          sign-in, sign-up, forgot password, first-time setup
app/(app)/           every signed-in page, wrapped in the app shell
components/          shared pieces: StatusPill, PosterCard, MemberCard, Timeline, FileDrop, Guard
components/ui/       buttons, fields, cards, sheets, tabs
lib/types.ts         data types, matching the Prisma models
lib/seed.ts          sample students, semesters, committee, elections
lib/store.ts         Zustand store; every action writes the audit log where the proposal says it should
lib/permissions.ts   which role can open which area, with the rule text shown when blocked
lib/selectors.ts     derived values: completeness, expiry, eligibility, turnout, winners
prisma/              PostgreSQL schema for the real build
docs/                walkthrough, draft content for approval, migration plan
```

## Out of scope for the prototype

- Real sign-in, a database, file storage, and email. These belong to the phase 1 build on the association's own PostgreSQL server
- Telegram and the scholarship department login, which the proposal leaves for later
- The membership letter and allowance flags
