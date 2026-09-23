# Moving files from the current portal

The current portal at my-zisar.ru holds student accounts and uploaded files: academic results, medical certificates, registration documents, green cards, and visa documents. This is how they move into the new portal without losing anything and without anything being marked verified by accident.

## Principles

- Nothing is deleted from the old portal until the committee signs off the move.
- Nothing arrives as **verified**. Every moved file arrives as **received** and waits for a verifier, as a new upload would.
- Students confirm their own records.

## Steps

1. **Export.** For each student account, export the profile fields (name, email, phone, university, programme) and every file with its upload date. Keep the export on the association's own storage, not in personal email.
2. **Match.** Create or find the student's new profile by email address. Where two profiles share an email, or none match, match by passport number. Anything that still does not match goes on a short list for a person to resolve.
3. **Classify.** Sort each file into a document type in the new portal: passport, visa, migration card, registration, insurance, medical certificate, green card, student card, or semester result. Files that cannot be classified go into "Other" with a note.
4. **Load.** Load each file as **version 1** of its document type, status **received**, with the original upload date. Semester result files are attached to the matching semester where the date makes it clear, and otherwise left as documents for the student to assign.
5. **Ask students to confirm.** Each student gets one notice: "We moved your files from the old portal. Check them, and replace anything out of date." The profile shows which fields came from the old portal until the student saves them.
6. **Verify in the normal way.** Verifiers work through the received files from the queue. The audit log records each decision, as for any upload.

## After the move

- Keep the old portal read-only for one semester, so anyone can check a file against the original.
- Then archive the export and close the old accounts, after the committee agrees.
