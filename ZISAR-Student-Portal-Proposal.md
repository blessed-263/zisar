<p align="center"><img src="assets/zisar-logo.png" alt="ZISAR logo" width="140"></p>

# Proposal: ZISAR Student Records, Verification, and Elections Portal

**Prepared for:** Zimbabwean Students in Russia (ZISAR)
**Context:** Students sponsored under the Presidential and National Scholarships, Office of the President and Cabinet
**Document type:** Discussion draft for the ZISAR committee
**Date:** 23 September 2026
**Status:** For review. Recommendations below are proposed defaults, not decisions already taken.

---

## 1. Executive summary

ZISAR already runs a document portal at [my-zisar.online](https://www.my-zisar.online/). A student creates an account, adds a university and programme, uploads files, and waits for an administrator to approve or request changes. That solves filing. It does not yet give the association a reliable picture of each student, semester by semester.

This proposal replaces that filing cabinet with a **student records portal**. Every sponsored student has one profile. Each semester, the student submits results against that profile. An administrator verifies the submission. The student is told the outcome. Notices, including image posters, go to the right people. Dates that can strand a student in Russia — visa, registration, migration card, insurance — are tracked before they expire.

ZISAR remains the operator. The portal keeps the association’s own verified record and can produce reports for the Presidential and National Scholarships Department. It does not, by itself, award, suspend, or pay a scholarship.

The same site has an elections page in three parts: an overview of the rules, the current committee, and an election portal for nominations and a secret ballot. The overview and the committee cards can go up immediately. Voting waits until the student roll is real, because a fair vote needs a list of who is actually a member.

**Build it in three phases.**

| Phase | What students and admins can do | Why this order |
| --- | --- | --- |
| 1. Foundation | Full profile, document vault with expiry dates, semester results verification, in-app and email notices, image announcements, admin queue, elections overview, current committee page, constitution and minutes, consent, an emergency alert to named officers | This is the daily work the current portal almost does, done properly. The committee page is only a register, so it does not have to wait for voting. The emergency alert is a button, not a new department |
| 2. Oversight | City or university coordinators, automatic expiry reminders, compliance reports, a semester report for the scholarship office, repeated-arrears flags, appeals, new-arrival checklist and a city mentor, university guides, help requests, travel notices, events, graduation and return, election portal (nominations, secret ballot, published results) | These need the verified roll, or a second officer, from phase 1 |
| 3. Partners | Read-only access for a named scholarship department liaison, Telegram delivery, alumni closure, restricted welfare notes | Only after privacy rules are agreed |

---

## 2. What exists today

The public portal describes five steps: create an account, complete a short profile, upload documents, track status, receive notifications. The documents it names are:

- academic results
- medical certificates
- registration documents
- green cards
- visa documents

That is a sound start. The limits show up as soon as the association needs to answer a real question.

- Results are files in a pile, not a semester history. There is no Autumn 2025 versus Spring 2026 record, so a verifier cannot see whether this sheet belongs to this term, or whether last term was already cleared.
- The profile stops at university and programme. Origin district, passport and visa dates, where the student actually lives, and who to call in an emergency are outside the system.
- A notification is a status change. It cannot carry an event poster, a registration-renewal drive, or a notice aimed only at one city.
- Nothing in the current description warns a student before a visa or registration date passes.
- One administrator queue is implied. Students are spread across Russian cities. A single inbox does not show who is overdue in Belgorod versus who is overdue in Moscow.
- There is no export the scholarship office can read without being handed a folder of unrelated PDFs.

The association site at zisar.ru is a separate public face: a blog, university information, and pointers to the Ministry and the scholarship department. This proposal does not replace that public site. It replaces the private work of knowing who the students are and whether their semester papers are in order.

---

## 3. The problem this portal is for

A Zimbabwean student in Russia is accountable to three places at once: the university, the Russian migration rules, and the scholarship that sent them. ZISAR sits between those three. Today that work depends on chat groups, forwarded photos, and a document upload page.

The failures are practical:

1. **A semester cannot be closed.** “Results uploaded” is not the same as “this semester is verified for this student.”
2. **The file is incomplete.** When a student is ill, or detained for an expired registration, the association does not have one place that holds the current phone number, hostel, visa date, and next of kin.
3. **Deadlines are manual.** Someone has to remember whose registration ends this month.
4. **Notices get lost.** A poster in a WhatsApp group reaches whoever happens to be online. Students who changed numbers never see it.
5. **The scholarship office receives anecdotes.** It cannot be shown, from one system, how many students submitted, how many were verified, and how many are still outstanding.
6. **The committee lives in a chat.** There is no single page that shows who holds office, and an election run in a group cannot show that each student voted once or that nobody can open their choice.

The portal’s job is to make those six things boring and repeatable.

---

## 4. Who it is for

| Person | What they come to do | What they must not be able to do |
| --- | --- | --- |
| Student | Keep their own profile true, submit documents and semester results, read notices, answer a query, appeal a decision, read the committee page, nominate and vote when an election is open, ask for help, send an emergency alert, file a travel notice | See another student’s file, another student’s help request, or how anyone voted |
| ZISAR verifier (admin) | Open a semester window, check submissions, approve or send back with a reason, post notices | Change a mark the student did not submit, delete history, decide their own appeal, or run an election they are standing in |
| Appeals officer (phase 2) | Review a contested verification. Uphold it, or send it back to the queue | Rewrite the original decision, or be the same person who made it |
| Welfare officer | Receive emergency alerts. From phase 2, answer help requests | Open the document vault unless they are also a verifier. Copy a help request into an announcement |
| Election officer (phase 2) | Draft an election, check nominations for eligibility, open and close voting, publish totals | See how a named student voted, or stand as a candidate in that same election |
| City or university coordinator (phase 2) | First look at students in their city: completeness, reminders, local announcements, the university guide, pairing a newcomer with a mentor | Final verification, unless the executive grants it |
| ZISAR executive | Read compliance, publish association notices and events, keep the current committee cards and the constitution files up to date, produce the semester report | Edit a result that a verifier has already signed, or administer an election in which they are a candidate |
| Scholarship department liaison (phase 3, optional) | Read a compliance report for sponsored students | Browse passports, medical notes, ballots, or chat |

Prospective students and the public stay on zisar.ru. This portal is for people who are already members of the association, plus the few officers who verify them.

---

## 5. Every potential use, and what to do with each

The list below is the discussion. Each use is marked so the committee can accept, delay, or refuse it without reopening the whole design.

**Core** means phase 1. The portal is incomplete without it.
**Next** means phase 2. Build it after the record is real.
**Later** means phase 3, and only with an explicit privacy decision.
**Leave out** means a real need that this portal should not try to meet.

### 5.1 The student record

| Use | Mark | Why |
| --- | --- | --- |
| One profile per student, with photo, identity, origin, contacts, scholarship, studies, and stay in Russia | Core | Every other feature hangs off this record |
| Student updates their own phone, email, Telegram, hostel, and emergency contact | Core | These change often and go stale in group chats |
| Student requests a change of university, programme, academic leave, or withdrawal; admin confirms | Core | Status must not be a free-text note that nobody trusts |
| Student downloads a personal checklist: what is verified, what is missing, what expires soon | Core | Cuts “did you get my file?” messages |
| Student asks for a correction after something was verified | Next | Needed, but the first semester should prove the happy path |
| Alumni flag when a student graduates and returns, without deleting the history | Next | Keeps the roll clean |
| Graduation and return record: expected finish, degree certificate, date of leaving Russia, and a Zimbabwe contact after return | Next | The alumni flag is only a status. The scholarship office needs the record behind it |
| At sign-up, the student agrees to what ZISAR stores and who may see a report. Later they can download their own profile and documents | Core | Passport images of people living abroad need that in writing |
| Welfare note visible only to named officers (illness, detention, family crisis) | Later | Useful in emergencies, dangerous if every admin can read it |

### 5.2 Documents

| Use | Mark | Why |
| --- | --- | --- |
| Upload the standard set: passport, national ID, visa, migration card, registration, student card, enrolment confirmation, medical insurance, medical certificate, baseline O and A level results | Core | This is what the current portal already attempts, with dates attached |
| Keep the current “green card” type until the committee names the exact paper | Core | It is already collected. Do not drop it, and do not guess its legal name in the database |
| Each file has an issue date, an expiry date where one exists, a status, and a reviewer note | Core | A PDF with no dates cannot drive a reminder |
| Resubmission keeps the old file | Core | A dispute needs the version that was rejected |
| Warn 60, 30, and 7 days before visa, registration, migration card, passport, and insurance expire | Next | The dates exist from phase 1; automatic chasing is phase 2 |
| New-arrival checklist for the first weeks: migration card, registration, insurance, university enrolment | Next | A guided list, not a new product |

### 5.3 Semester results

| Use | Mark | Why |
| --- | --- | --- |
| Admin opens a named semester window with a deadline, for example Autumn 2026/27 | Core | Verification is per semester, not “whenever a file arrives” |
| Student enters the session result and attaches the official sheet (ведомость, transcript, or university printout) | Core | The sheet is the evidence; the entered result is what gets reported |
| Admin compares the sheet to the entry and chooses Verified, Query, or Rejected, with a written reason | Core | This is the heart of the proposal |
| Overdue flag when the window closes and nothing was submitted | Core | Silence must be visible |
| Full history: every semester stays on the profile | Core | Replaces the pile of unrelated result files |
| Flag a student with arrears (academic debts) or a second unsatisfactory semester | Next | A flag for human follow-up, not an automatic punishment |
| Appeal to a second officer. The first decision and its reason stay visible underneath | Next | A query is a question. An appeal is a review by someone who did not make the decision |
| A semester report for the scholarship office, drawn from verified sessions: name, programme, sessions cleared, arrears, missing documents | Next | This is the point of collecting the results. The report does not suspend a scholarship |
| Preparatory-year (подфак) sessions recorded separately from degree semesters | Core | A language-year sheet must not be stored as “Year 1, Semester 1” of the degree |

Russian universities generally run an autumn semester and a spring semester, with an exam session at the end of each. The portal should follow that calendar. A “semester” in this system means one of those sessions, including the preparatory faculty where that is the student’s current stage.

### 5.4 Notices

| Use | Mark | Why |
| --- | --- | --- |
| In-app inbox plus email when a document or a semester result is verified, queried, or rejected | Core | The student must see the reason, not only a colour |
| Announcement with a title, a message, and an image | Core | Meetings, medical drives, and registration days are posters, not plain text |
| Audience: all students, one city, one university, one cohort, or only students who are overdue or expiring | Core | A Moscow registration notice should not spam Kazan |
| Student can mark a notice read | Core | Admins can see who has not opened a deadline notice |
| Scheduled reminder before a semester deadline | Next | Same engine as document expiry |
| Emergency alert to named officers, using the city and phone already on the profile | Core | A student in trouble should not have to wait for a later phase |
| An event with a date, a city, an image, and a way to say “I am coming.” No comments | Next | An AGM or a city meet-up is not the same as a news post |
| Telegram delivery | Later | Most students in Russia already live on Telegram. Add it after email works, and only if the student opts in |

### 5.5 Administration and reporting

| Use | Mark | Why |
| --- | --- | --- |
| Queue of submissions waiting for review, filterable by status, university, city, and cohort | Core | The verifier’s home screen |
| Record of who verified what, and when, including the reason sent to the student | Core | Needed the first time someone disputes a rejection |
| Executive view: submitted, verified, queried, rejected, overdue, by university | Core | Enough to run the association |
| Export for the Scholarships Department: name, university, programme, year, semester status, missing items. No passport images in the default export | Next | Gives the office numbers without handing over the whole vault |
| Coordinator accounts limited to one city or one university | Next | Do not block phase 1 on a full hierarchy |
| Read-only liaison login | Later | Only for a named office, with a written data-sharing note |

### 5.6 Elections

The elections area is one page with three tabs. The rules and the people in office are part of the first release. The ballot is the next release, because it depends on the student roll.

| Use | Mark | Why |
| --- | --- | --- |
| Overview of how a ZISAR election works: term, offices, who may vote, who may stand | Core | Members should read the rules in the portal, not in a forwarded PDF |
| Current committee cards: office, photo, name, university, city, term, contact for that office | Core | Replaces “who is the president?” in the group chat |
| Vacant seat shown as vacant, with a record of who last edited the card | Core | An empty office should look empty |
| Nominations with a photo, a statement, a proposer, and a seconder | Next | Needs a list of eligible members |
| Officer accepts or declines a nomination on eligibility only, with a reason | Next | A statement is not a reason to block someone |
| Secret ballot, one vote per office, abstain allowed, ballot locks after confirm | Next | The point of moving the election out of chat |
| Receipt that proves the student voted, and does not name their choice | Next | A receipt that shows the choice can be demanded under pressure |
| City seat voted only by students whose profile city is that city | Next | A Moscow representative is not elected by Kazan |
| Publish turnout and totals, then confirm before winners replace the committee cards | Next | A result should not silently rewrite who is in office |
| By-election for one vacant seat, using the same portal | Next | Same rules, fewer offices |
| Archive of previous committees | Next | Phase 1 only needs the people in office now |
| Constitution, standing rules, and general-meeting minutes filed beside the overview | Core | The voting rules and the document that states them should sit on the same page |

### 5.7 Life in Russia

| Use | Mark | Why |
| --- | --- | --- |
| Private help request: what happened, plus the city and phone from the profile. Only the welfare office can open it | Next | The portal talks to students. They also need a way to ask |
| Travel notice: date of leaving Russia, date of return, and whether registration must be renewed on the way back | Next | The association should not find out at the airport |
| A guide for each university: registration, the international office, insurance, the hostel. Members can read every guide. A coordinator for that university writes it | Next | The answers differ by city, and the same questions arrive every September |
| A newcomer paired with an older student in the same city, who agrees to share a contact | Next | The arrival checklist needs a person, not only a list |

### 5.8 Uses this portal should not take on

| Use | Mark | Why it stays out |
| --- | --- | --- |
| Paying or tracking stipends and allowances, including a monthly “not received” flag or any bank detail | Leave out | The scholarship office owns the money. A yes-or-no flag still pulls the portal into payment disputes |
| A membership letter or a card on the phone | Leave out | The profile and the semester report already say who the student is and where they study. A second identity document is a separate decision |
| A housing market, job board, or open social feed | Leave out | zisar.ru and the existing chats already carry community life. A verification system should stay trusted and quiet |
| Automatic reading of Russian transcripts into marks | Leave out | A wrong automatic mark is worse than a human verifier looking at the sheet. Translation aids can be revisited only as a helper beside the human, never as the decision |
| Replacing the scholarship application process in Harare | Leave out | The department already has its own procedure. This portal prepares ZISAR’s record and a report it can request |

---

## 6. The student profile

One student, one profile, ten sections. Fields marked optional can be empty on day one. Fields marked required must be filled before the first semester result can be submitted. The student can save a draft before that.

Creating the account requires a consent tick. The text is written by the committee and stored with a version and a date. It says what ZISAR keeps, who inside the association can see it, and that a report for the scholarship office contains no passport images unless a named officer produces a special export. The student can later download their own profile and their own documents. That download contains nobody else’s file.

### 6.1 Identity (required before first submission)

- Profile photo
- Surname, first name, and other names, as printed on the passport
- Name the student actually uses, if different
- Date of birth and sex
- National ID number
- Passport number, issuing country, date of issue, date of expiry
- District and province of origin, as on the birth certificate or national ID (the scholarship department already asks for district of origin)

### 6.2 Contacts (required: one working phone and one email)

- Email used to sign in
- Zimbabwe phone number
- Russia phone number
- Telegram username (optional, used later if Telegram notices are turned on)
- WhatsApp number, if different

### 6.3 Scholarship

- Scholarship: Presidential, National, or other (stated in words)
- Year the award started (cohort)
- Level at award: preparatory, bachelor, specialist, master, or PhD
- Status: active, on academic leave, suspended, completed, withdrawn
- Any reference number the scholarship office has already issued (optional)

The portal stores status. It does not decide status. A suspension is recorded only after the responsible office or the ZISAR executive confirms it.

### 6.4 Studies (required before first submission)

- University, in English and in Russian if the student has both
- City
- Faculty, department, and programme
- Student number used by the university (зачётка or student card number)
- Language of instruction
- Current stage: preparatory year, or year of study in the degree
- Date studies began, and expected completion
- Academic status: enrolled, academic leave, transferred, graduated, withdrawn

### 6.5 Stay in Russia

- Visa number, type, and expiry
- Migration card number and expiry
- Registration address and registration expiry
- Housing: university hostel, or private address
- Medical insurance provider, policy number, and expiry

Travel sits beside this section, from phase 2. A notice is not a new profile. It records a date of leaving Russia, a date of return, a short reason (holiday, family emergency, end of studies, or other), and whether registration will have to be renewed on return. The student, the welfare office, and the coordinator for that city can see it. Other students cannot.

### 6.6 Emergency (required: one next of kin)

- Next of kin in Zimbabwe: name, relationship, phone, and town
- A second contact who can be reached if the first cannot
- A person in Russia who can be called the same day (optional)
- Anything a doctor would need in an emergency, only if the student chooses to record it (blood group, a serious allergy). Hidden from ordinary coordinators

### 6.7 Academic history

Built from verified semesters. The student does not type a separate “history.” It appears as each session is verified. See section 7.

### 6.8 Document vault

Built from uploads. See section 8.

### 6.9 Notices

The student’s inbox, and their choice of email on or off for non-urgent announcements. Decision notices (verified, queried, rejected, and deadline warnings) always go by email as well as in the portal. A student must not be able to silence a rejection. An emergency alert and a reply to a help request also always go by email.

### 6.10 Graduation and return

Filled when studies are ending, not on the first day. The student records the expected finish date if it has changed, uploads the degree certificate when they have it, the date they leave Russia, and a phone number and town in Zimbabwe for after the return. An administrator confirms the record. The history of semesters stays. Closing the account so the student can no longer sign in is a later step. The record is not deleted.

---

## 7. Semester verification

### 7.1 Opening a semester

An administrator creates a window:

- Name, for example `2026/27 Autumn session`
- Which students it applies to: preparatory only, degree students only, or everyone enrolled
- Open date and deadline
- Short instruction (what sheet the university issues, and whether a photo of the stamped sheet is acceptable)
- Optional image, if the instruction is a poster

Students in scope see the window on their home screen. Students outside scope do not.

### 7.2 What the student submits

For that window, one submission containing:

- The session the sheet belongs to (must match the open window)
- Overall outcome the student is declaring: satisfactory, satisfactory with arrears, or unsatisfactory
- A short list of subjects that were failed or left as debts, if any. Subject name, and the mark if the student has it. Empty if the student passed everything
- The file: PDF or a clear photo of the official sheet
- A tick: “This sheet is mine, it is for this session, and I have not hidden a failed subject”

The student may save a draft. Only Submit sends it to the queue. After submit, the student can no longer edit it. If the admin queries or rejects it, the portal opens a new response on the same submission, and the previous file stays attached.

### 7.3 What the administrator checks

The review screen shows the profile summary beside the file. The verifier is checking five things only:

1. The sheet belongs to this student (name, student number).
2. The sheet is for this session, not an older one reused.
3. The declared outcome matches the sheet, including any arrears.
4. The file is readable. A blur, a crop that hides the name, or a screenshot with no stamp goes back as a query.
5. The profile is complete enough to know who this is (identity and studies required fields).

The verifier then chooses one:

| Decision | Meaning | What the student gets |
| --- | --- | --- |
| Verified | The sheet matches the declaration | A notice that this semester is closed |
| Query | Something specific is missing or unclear | The question, and a way to reply with a new file without starting from zero |
| Rejected | The sheet is the wrong session, the wrong person, or contradicts the declaration | The reason, and a fresh submission for the same window |

There is no silent rejection. Every query and rejection stores the reason in the audit record.

### 7.4 After the deadline

On the deadline:

- Drafts that were never submitted stay drafts and are marked overdue.
- Students with no submission are marked overdue.
- Submitted work still in the queue stays in the queue. A late review must not punish a student who submitted on time.
- A student who was queried before the deadline gets a short reply window, set by the admin (suggested default: 14 days).

Overdue is a status for follow-up. It is not, inside this portal, a scholarship decision.

### 7.5 Appeal

A student may appeal within 14 days of a verified or rejected result. The appeal goes to a named appeals officer who did not make the original decision. The officer sees the sheet, the declaration, and the reason already given. They may uphold the decision, or send the submission back to the queue with a note. They do not type a new mark, and they do not erase the first decision. Both stay on the record. The student is told which of the two outcomes was chosen, and why.

### 7.6 Semester report

An executive can produce a report for one student or for a cohort. It is drawn only from sessions that have been verified, plus a line where a session is still missing or still in the queue. It names the student, the university, the programme, the year, the sessions cleared, any arrears already declared, and the documents still missing. It does not include passport images. An unverified session is shown as not yet verified. It is not shown as a pass. The report does not suspend, restore, or pay a scholarship.

### 7.7 A semester on one screen

```text
Admin opens "2026/27 Autumn session"
        |
        v
Student sees the window on their home screen
        |
        +--> saves a draft (only the student can see it)
        |
        +--> submits sheet + declaration
                |
                v
        Verifier queue
                |
                +--> Verified ---- semester closes on the profile
                |
                +--> Query ------ student replies on the same submission
                |                      |
                |                      +--> back to the queue
                |
                +--> Rejected ---- student may submit again while the window is open
```

---

## 8. Documents and expiry

Document types are a fixed list, so reports mean the same thing for every student. Proposed list, combining what the current portal already collects and what a stay in Russia actually requires:

| Type | Expiry tracked | When it is first needed |
| --- | --- | --- |
| Passport bio page | Yes | Before the first submission |
| National ID | No | Profile completion |
| Birth certificate | No | When the scholarship file is being assembled |
| Visa | Yes | As soon as it is issued |
| Migration card | Yes | On arrival |
| Registration | Yes | On arrival, and at each renewal |
| Student card | Yes, if the card itself expires | When the university issues it |
| Enrolment confirmation or university order | No | Start of studies, and after a transfer |
| Medical insurance | Yes | On arrival |
| Medical certificate | Yes, if the certificate states a validity | When the university or hostel requires it |
| Green card | Yes, if the committee confirms it expires | Keep, and name it properly in the first committee sitting |
| O Level and A Level results | No | Once, as the baseline academic file |
| Prior degree transcript and certificate | No | Master and PhD students only |
| Degree certificate at the end of the current studies | No | The graduation and return record |
| Semester results sheet | No (it belongs to a semester, not to an expiry clock) | Every open window |

Each upload records: type, file, date of the document, expiry if any, who uploaded it, status (received, verified, queried, rejected), reviewer, and note.

A newer upload of the same type does not erase the older one. The newest verified file is the current one. Older ones remain as history.

---

## 9. Notifications, including images

Two different things share the word “notification.” They should not be built as one blob.

**Decisions** are automatic and personal. A document or a semester result changes state, and the student is told. The message names the item, the decision, and the reason. No image is required. Email is always sent.

**Announcements** are written by an admin. They have a title, a body, an optional image, and an audience. Uses that are already foreseeable:

- A general meeting, with the poster
- Registration renewal week in a named city
- A medical insurance drive
- The opening of a semester window (the system can also generate this itself)
- A welfare check after an incident that affects one university

**Election notices** are automatic, like decisions. They go out when nominations open, when a nomination is accepted or declined, when voting opens, once before voting closes, and when results are published. The results notice can carry the official poster. They are not typed as ordinary announcements, so a candidate cannot rewrite one.

**Emergency alerts** go only to the officers named for that purpose, by email and in the portal, at the moment the student confirms. The message is the student’s name, city, phone, and the time. It does not attach the document vault.

**Events**, from phase 2, are not announcements. An event has a title, a date, a city, a short description, and an optional image. A student in that city, or every student if the event is for the whole association, can mark that they are coming. Members see the count. Officers see the names. There is no comment thread.

An announcement is not a place to discuss a student’s marks or a student’s vote. Academic decisions stay on the submission, where they are audited. Election totals stay on the elections page.

Delivery in phase 1 is the in-app inbox and email. The inbox shows a thumbnail when the announcement has an image. Unread count sits on the student’s home screen.

Phase 2 adds scheduled sends: semester deadline in 7 days, document expiring in 30 days. Phase 3 adds Telegram for students who have opted in and saved a username. WhatsApp is not proposed. It is a poor fit for an official record, and the association already uses it informally.

---

## 10. Elections

The elections area is one page inside the signed-in portal, with three tabs: Overview, Current committee, and Election portal. Members read all three. People who are not members do not see the voter roll, draft nominations, or ballots.

Voting is separate from academic verification. The person who checks semester results does not thereby run an election. A candidate does not run the election they are standing in.

### 10.1 Overview

The overview is text the executive writes and the portal displays. It is not buried in code. It should say:

- What the election chooses, and how long the term lasts
- The offices, taken from ZISAR’s own constitution
- Who may vote, and who may stand
- How a vacant seat is filled
- Whether an election is open, and if so, the dates

Until the constitution’s list of offices is pasted in, the portal should not pretend those offices are settled. A starter list the committee can adopt or replace:

| Office | Who votes |
| --- | --- |
| President | Every eligible member |
| Vice President | Every eligible member |
| Secretary General | Every eligible member |
| Treasurer | Every eligible member |
| Academic affairs | Every eligible member |
| Welfare and scholarship liaison | Every eligible member |
| Information and publicity | Every eligible member |
| City representative, one seat per city that has members | Only members whose profile city is that city |

Recommended rules, for the committee to accept or rewrite on the overview itself:

- Term: one academic year, from the published result until the next published result.
- Vote: an enrolled student with the identity and studies parts of the profile complete. Withdrawn, graduated, and suspended accounts cannot vote.
- Stand: the same rules, and the student expects to remain in Russia for the term. A student on academic leave may vote and may not stand.
- One candidate, one office, in a given election.
- A city seat uses the city on the profile. The candidate does not type a different city in order to stand somewhere else.

The election portal enforces the same rules the overview states. If the two disagree, the portal is what gets corrected.

Under the same tab, the executive files three kinds of document: the constitution, the standing rules, and the minutes of general meetings. Members can read them. They cannot comment on them. A file stores who uploaded it and when. The overview text and these files are how a member checks that the ballot is following the association’s own rules.

### 10.2 Current committee

A register of who holds each office now. Each card shows:

- Office
- Photo
- Full name
- University and city
- Term start and term end
- A short note on what that office does
- A contact for association business: a shared email or a Telegram for that office. Not a passport number, a national ID, or a home address

A seat with nobody in it is shown as vacant. Students see the cards. Only a named executive editor can change them. Every change stores who changed it and the time.

This draft does not name the sitting committee. The current executive types those names in before students see the page. A title on a personal LinkedIn profile, or a “team coming soon” block on zisar.ru, is not a source for this register.

When an election result is published, the portal can offer to copy the winners onto these cards. A person still confirms that step. It does not happen by itself, in case a winner declines the seat.

Previous terms stay as an archive: year, office, name. That archive is phase 2. Phase 1 only needs the people in office now.

### 10.3 Election portal

One election at a time is enough. A by-election is the same object with fewer offices.

The election moves through these states. Only the election officer sees it while it is a draft. Everyone eligible sees it from nominations onward, at the stage it has reached.

| State | What happens |
| --- | --- |
| Draft | Offices, dates, and quorum are set. Not visible to students |
| Nominations open | Eligible students submit for one office |
| Vetting | Nominations are closed. The officer accepts or declines each one |
| Statements | Accepted candidates are visible. Voting is not open yet |
| Voting open | One ballot per eligible student |
| Closed | Totals are calculated and not yet public |
| Published | Turnout and winners are on the page |
| Archived | The election stays readable. It can no longer be edited |

**Nominations.** An eligible student submits, for one office: a photo, a statement of what they will do, and a proposer and a seconder. University and city come from the profile. The proposer and the seconder must each confirm in the portal, and both must be eligible voters. The officer then accepts or declines. A decline needs a reason, and the student sees it. The only reasons are eligibility: not enrolled, profile incomplete, already standing for another office, proposer or seconder not confirmed, or the wrong city for a city seat. The officer does not decline a nomination because they dislike the statement.

**Voting.** The voter sees each office, the accepted candidates with their photos and statements, and an abstain choice. They vote once per office. A confirmation screen shows the choices. After they confirm, the ballot locks. A receipt says that they voted and at what time. The receipt does not name the candidates they chose.

The ballot is stored apart from the voter’s name. The system can show that a named student has voted. It cannot show a screen of how that student voted. After close, the election officer sees turnout and totals. They do not see individual ballots. A second student who is not a candidate, the scrutineer, sees the same totals.

**Count.** The winner of an office is the candidate with the most votes. A tie is not broken by the officer typing a name. The recommended rule is a short runoff between the tied candidates, on that office only. Quorum is a number or a percentage set when the election is drafted. If turnout is below quorum, the result is published as not confirmed, and the current holder stays until a rerun. If the committee wants no quorum, they set it to zero and say so on the overview.

**Who may run it.** The election officer is appointed for that election and must not be a candidate in it. Sitting executives who are standing again cannot open, close, edit candidates, or publish that election. Academic verifiers do not see this screen unless they are the appointed officer and they are not standing.

```text
Officer drafts the election (offices, dates, quorum)
        |
        v
Nominations open
        |
        +--> student submits; proposer and seconder confirm
        |
        v
Officer accepts or declines on eligibility only
        |
        v
Statements visible, then voting opens
        |
        +--> one locked ballot per voter
        |    receipt shows the time, not the choice
        |
        v
Close and count
        |
        +--> published turnout, winners, and any runoff
        |
        v
Officer confirms before winners replace the current committee cards
```

### 10.4 The three tabs

| Tab | Student sees | Officer sees in addition |
| --- | --- | --- |
| Overview | The rules, the offices, whether an election is open, and the constitution, standing rules, and minutes | An editor for that text, and the file upload |
| Current committee | One card per office, including vacant seats | Edit a card, mark a seat vacant |
| Election portal | The live stage: nominate, read statements, or vote. If nothing is open, the last published result | Draft, vet, open and close, turnout, publish. Never a list of who voted for whom |

---

## 11. Member services

These are the practical tools around the record. They do not replace verification, and they do not handle money.

### 11.1 Help request

From phase 2, a student opens a private request: what happened, and the city and phone taken from the profile. The phone can be corrected for this request if the one on the profile is wrong. Only the welfare office can read it. A reply stays on the same request. Status is open, answered, or closed. Other students never see it. It is not copied into an announcement. Every time an officer opens a request, that opening is logged.

### 11.2 Emergency alert

From the first release, the student home has one control: “I need help now.” A confirmation screen sits in front of it, so a pocket press does not send it. On confirm, the named welfare officers receive the name, the city, the phone, and the time, by email and in the portal. They can mark it received. The alert does not open the passport, the medical file, or the semester sheet. Those stay behind the normal permissions.

The committee names the officers before this control is switched on. Two is enough. The whole executive does not need to receive every alert.

### 11.3 Travel notice

From phase 2, a student records a trip out of Russia: leaving date, return date, reason, and whether registration must be renewed on return. The welfare office and the coordinator for that city see the open trips. When the student is back, they mark the notice closed. A trip that passes its return date and is still open shows on the coordinator’s list for a check, not as a punishment.

### 11.4 University guide

From phase 2, each university has one page: how registration is done there, the international office, insurance, and the hostel office, plus the date it was last updated and who updated it. Every member can read every guide, so a student changing city can look ahead. Only a coordinator for that university can edit it. This page is not the public blog on zisar.ru.

### 11.5 A person to call

The new-arrival checklist already belongs to phase 2. Beside it, a coordinator can offer a newcomer one older student in the same city. The mentor accepts or declines. If they accept, the newcomer sees the mentor’s name, university, and a phone or Telegram the mentor has agreed to share. The mentor does not see the newcomer’s passport or medical file.

### 11.6 Events

From phase 2, an officer publishes an event with a title, a date, a city or “all cities,” a description, and an optional image. A student marks that they are coming. Members see how many are coming. Officers see the names. There is no comment thread under the event.

---

## 12. What each person sees

### Student home

- Their photo, university, and academic status
- This semester’s window, or “no window open”
- Documents expiring in the next 60 days
- Unread notices
- A short checklist of required items still missing
- Elections: a link to the current committee, and a banner when nominations or voting are open
- “I need help now,” behind a confirmation screen
- From phase 2: a help request, a travel notice, events in their city, and the guide for their university

### Verifier home

- Count waiting for review, split into semester results and documents
- Overdue count for the open window
- Latest announcements, so they can see what students were told
- Search by name, passport number, or university student number
- Appeals are not on this screen. They go to the appeals officer

### Executive home

- Students by status: enrolled, on leave, graduated, withdrawn
- For the open semester: submitted, verified, queried, rejected, overdue
- The same numbers by city and by university
- No passport images on this screen
- A link to edit the current committee cards and to file the constitution, standing rules, and minutes
- The semester report, for one student or a cohort
- From phase 2: events, and who has said they are coming

### Welfare office

- Emergency alerts, newest first, with a way to mark one received
- From phase 2: open help requests, and travel notices whose return date has passed

### Appeals officer (phase 2)

- Contested results waiting for a review
- The original decision, still visible, and not editable from this screen

### Election officer home (phase 2)

- The election’s current state
- Nominations waiting for a decision
- Turnout while voting is open
- Totals after close
- No screen that pairs a student’s name with a candidate

---

## 13. Security and care of personal data

The portal will hold passports, national IDs, addresses, and medical files of young people living abroad. That is the part of this proposal that has to be taken as seriously as the workflow.

- A student sees only their own file.
- Coordinators, when they exist, see only their city or university, and they do not see optional medical notes.
- Verifiers see files because they cannot verify a sheet they cannot open. That access is logged.
- Passwords are stored only as hashes. Sign-in is email plus password, with a reset by email.
- Files are stored so that a link cannot be guessed. Opening a passport requires a logged-in user who is allowed to see it.
- Exports for outside offices exclude document images unless a named officer generates a special export and that action is logged.
- Nothing is destroyed when a student graduates. The account is closed to sign-in, and the record is kept for the association’s accountability. How many years it is kept should be agreed with the scholarship department before phase 2 reporting begins. A working assumption of five years after completion is a placeholder, not a legal opinion.
- The committee should name two people who can recover an admin account, so the system is not locked to one laptop.
- A ballot is stored so that “this student has voted” and “this candidate received this many votes” cannot be joined back into “this student chose this candidate.”
- A candidate cannot be the election officer or the scrutineer for an election they are in.
- The scholarship department liaison, when that role exists, does not see ballots, nominations in draft, who voted, help requests, or emergency alerts.
- A help request and an emergency alert are visible only to the officers named for them. Opening a help request is logged.
- A mentor sees a contact the newcomer is allowed to share. A mentor does not see the document vault.
- The student’s own download contains their profile and their documents. It is not a way to export the roll.

This proposal does not claim a particular hosting company or a budget. Those are decisions for the build, after the committee accepts the scope.

---

## 14. How it should be built

Phase 1 is a phone-friendly website. Students will use it from a phone in a hostel. Admins need a wider screen for the queue, but the same site must remain usable on a phone.

Suggested phase contents, so a builder can estimate without inventing features:

**Phase 1**

- Accounts for students and admins
- The profile in section 6
- The document vault in section 8, with manual review
- Semester windows and the verify / query / reject flow
- Decision emails and the announcement composer with an image
- The home screens in section 12
- An audit line on every verification
- Elections overview and the current committee page in section 10, including the constitution, standing rules, and minutes. The executive enters the real names before students see them
- Consent at sign-up, and a download of the student’s own file
- The emergency alert in section 11.2, switched on only after the welfare officers are named

**Phase 2**

- Coordinator role, scoped to a city or a university
- Automatic reminders for deadlines and expiry dates
- Excel or CSV compliance export
- Arrears carried across semesters, shown as a flag
- New-arrival checklist
- Correction requests on a verified item
- The election portal in section 10.3: nominations, locked secret ballot, published results, and the offer to update the committee cards
- Appeals, the semester report, help requests, travel notices, university guides, mentors, events, and the graduation and return record in sections 6.10, 7.5, 7.6, and 11

**Phase 3**

- A liaison role with no access to document images by default
- Telegram opt-in
- Alumni closure
- Restricted welfare notes

Each phase should be usable on its own. Phase 1 must already be better than the current upload portal, or it is not worth switching.

---

## 15. What will be true if this works

After one full academic year on phase 1, the executive should be able to say, without opening a chat group:

- How many enrolled students the association holds a profile for
- For the last autumn session and the last spring session, how many were verified, queried, rejected, or overdue
- Which universities have the most overdue submissions
- Which students have a visa, registration, or insurance date inside the next 60 days
- What was announced, to whom, and that a decision notice was sent
- Who holds each office, and when that term ends

A student should be able to say what is still missing on their own file, and why a result was sent back, without asking an admin to look it up. They should be able to reach a named officer in an emergency without posting their situation in a group, and they should be able to download their own file.

After phase 2, the same page should also show who is out of Russia and which return dates have passed, and, for a student who has finished, the leave date, the Zimbabwe contact, and whether the degree certificate is on file. The scholarship office should be able to take a semester report that lists only verified sessions.

After the first election run on the portal, any member should be able to open one page and see the rules, the turnout, and the winners. No officer should be able to open how one named student voted.

---

## 16. Risks and the assumptions underneath them

| Risk | What we are assuming | If the assumption is wrong |
| --- | --- | --- |
| Students refuse a second system | The current portal is weak enough that a clearer one will be used, especially if semester clearance depends on it | Keep upload simple, and let city coordinators help the first window |
| A result sheet in Russian is misread | Verifiers include students who can read the sheet, or the instruction tells the student to add a one-page English summary beside it | Do not automate reading. Train a small verifier group |
| The scholarship office expects this system to suspend awards | The portal only records and reports | Say that in the first meeting with the office, in writing |
| Personal data leaks through a shared admin password | Named admin accounts from the first day | Do not go live with a single shared login |
| “Green card” means different papers to different students | The type stays, and the committee writes one definition | Fix the label before students are told to upload it |
| Scope grows into stipends and housing | Those stay outside this build | A new proposal, not a quiet addition |
| A candidate runs their own election | The officer and the scrutineer are not candidates, and the ballot is not tied to a name | Do not open voting until both are appointed |
| Students are pressed to prove how they voted | The receipt shows the time, not the choice, and the ballot locks | Do not add a button that redisplays the choice |
| An emergency alert reaches the wrong people, or is sent by a pocket press | Two named officers receive it, and a confirmation screen sits in front of the button | Do not switch the button on until those officers are named |
| A help request is treated as gossip | Only the welfare office can open it, and each opening is logged | Do not copy a request into an announcement or a group chat |

---

## 17. Decisions the committee should take before a build

These are the few choices that change the design. Recommended answers are included so the discussion has a starting point.

1. **Who is the verification for?**
   Recommended: ZISAR verifies its own roll, and can hand the scholarship department a report. The portal does not suspend a scholarship.

2. **What is the green card?**
   Recommended: keep the upload type. At the next sitting, write one sentence that names the physical document students already submit under that label.

3. **Who may verify in the first semester?**
   Recommended: a small central group of named verifiers. City coordinators come in phase 2, after the first window has been run once.

4. **Will the scholarship department log in?**
   Recommended: not in the first release. Give them an export. A login is phase 3, and only with a short written note on what they may see.

5. **Does this replace my-zisar.online?**
   Recommended: yes, once phase 1 is accepted and the current files that still matter have been moved. Running two portals will split the record again.

6. **Which calendar does the first window follow?**
   Recommended: the upcoming exam session, named in the Russian university way (autumn or spring, plus the academic year), with preparatory students in the same window only if their session falls on the same dates. If it does not, open a second window for the preparatory faculty.

7. **What are the election rules?**
   Recommended: a one-year term; the offices in section 10.1 unless the constitution names others; enrolled students with a complete profile may vote; a student on academic leave may vote and may not stand; quorum is set per election and a missed quorum leaves the current holder in place; a tie goes to a runoff. The executive enters the real names on the current committee page before that page is shown.

8. **Who runs the first election?**
   Recommended: one election officer and one scrutineer, neither of them a candidate. Academic verifiers do not inherit this job.

9. **Who receives an emergency alert or a help request?**
   Recommended: two named welfare officers. They do not automatically see the document vault. The appeals officer is a different person from the verifier on that file.

---

## 18. Suggested next step

Hold one committee sitting with this document. Accept, delay, or strike each use in section 5. Answer the decisions in section 17, including the offices, the names for the current committee page, and the two welfare officers. After that, phase 1 is ready to scope as a build: profile, documents, one semester workflow, notices with images, an admin queue, the elections overview with the sitting committee and the constitution files, consent, and the emergency alert. The ballot, help requests, travel notices, guides, mentors, events, appeals, the semester report, and the graduation record are phase 2, once that roll exists.

Until those decisions are made, no stipend module, no public social feed, and no outside logins should be added to the plan.
