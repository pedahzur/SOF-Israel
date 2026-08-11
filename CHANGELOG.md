# Manuscript Change Log

## 2026-08-10 — Restructure into Introduction plus eleven chapters

- Split the August 2026 merged working file (242,928 words) into twelve prose
  files: `manuscript/chapters/00_Introduction.md` through
  `11_The_Institutional_Reckoning.md`. Chapter 11 was created by splitting the
  former Chapter 10: sections 10.1 to 10.10 remained Chapter 10, sections 10.11
  and 10.12 became Chapter 11.
- Renumbered all 132 subchapters sequentially in the body text. Chapter 2 had
  been numbered 1.1 to 1.12; Chapter 6 carried half and three-quarter sections.
- Unified three endnote notation systems into one per-chapter sequence, 749
  notes, live-linked in Markdown and rendered as native Word endnotes at the end
  of each chapter in `exports/chapters/`. Reference and endnote counts match in
  every file (752 including three repeated references in Chapter 5).
- Stripped endnotes to citation only, about 64 percent shorter: removed
  discursive text, internal `05_Working_Drafts` pointers, VERIFY brackets, and
  Wikipedia entries. No citation was invented; every gap is marked in place.
- Removed roughly 21,300 words of drafting scaffolding and a duplicated
  Chapter 3 tranche, archived in
  `editorial/REMOVED_from_the_merged_draft_2026-08-10.md`.
- Applied 41 mechanical style corrections and logged 1,049 items for review in
  `editorial/AUDIT_SOF_Book_2026-08-10.xlsx`.
- `manuscript/Book.md` is retained unchanged as the July baseline. Whether the
  chapter files supersede it as the canonical source is Ami's call.

### Open, blocking

- 282 endnotes have no text. The `[^fn]` pool in the merged file held 285
  definitions but only 140 distinct texts, being Chapter 9's set repeated three
  times and renumbered; Chapters 6 (79 notes) and 7 (118 notes) therefore have
  no endnote text in that file, and Chapter 2 is missing 85 of 104. A further
  22 notes are marked TK.
- The Introduction's framework does not appear in the chapters: "critical
  juncture" occurs nine times in Chapter 7, once in Chapter 6, and nowhere else;
  Soifer's permissive and productive conditions, Kingdon, and Lewis and Steinmo
  appear in no chapter.
- "institutional" and its cognates occur 2,166 times, 13.2 per thousand words,
  rising to 54.7 per thousand in Chapter 11.
- 765 places carry two consecutive sentences of more than thirty words.

See `exports/ACTION_PLAN_to_publication.docx` for the sequenced plan.

## 2026-07-29 — Deduplicated baseline

- Established the private `book-manuscript` branch.
- Added the deduplicated May 2026 manuscript as the canonical Markdown source.
- Added the corresponding Word working copy with 840 native endnotes.
- Removed superseded drafts, stale skeletons, and production scaffolding from
  the manuscript body.
- Preserved editorial queries in `editorial/cleanup-audit.md`.
- Resolved the duplicated Chapter 5 note labels `31c` and `31e` without losing
  the Operation Naqar source.
