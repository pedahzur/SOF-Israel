# SOF Definitions — Design Spec

**Date:** 2026-06-06
**Author:** Ami Pedahzur (with Claude)
**Context:** A 1–2 page discussion for a book on Special Operations Forces, demonstrating that the SOF concept is dynamic and fluid — that the definition of a special-operations unit is a function of the challenges it was built to meet, and therefore varies across place and era.

---

## 1. Goal

Use the existing corpus of academic (and doctrinal) definitions of "special operations forces" to make a two-level argument:

1. **Level 1 — competing *terms*:** Special Forces, Elite Forces, Tactical Teams, Special Operations Forces, Other Units are not interchangeable; each carries a different conception.
2. **Level 2 — competing *definitions* within a term:** even for a single term, definitions diverge by what they key on (designation / organization / operators / role & function), and that divergence tracks the author's background and era.

**Payoff:** the definition is a function of the challenge-set a unit was built for, hence it shifts across place and time — directly supporting the book's thesis.

## 2. Deliverables

1. A clean, reliable definitions dataset (new Google Sheet + local working copy).
2. A repeatable, gap-filling research workflow for finding and adding missing definitions.
3. A 1–2 page argument-driven discussion for the book, evidenced by the dataset.

## 3. Source material

- Existing Google Sheet (treated as untouched archive):
  `https://docs.google.com/spreadsheets/d/1M0tM60v6vK18L7JImPIul15qLwlg4ZSMarfXmFEvPMQ`
- ~227 raw rows in the export, of which roughly **~44 are genuine coded definitions**; the rest is contamination from a past Tana sync (emoji supertags, mailing addresses, ISO dates bleeding into the Year/Title-Code columns) plus markdown-export row-wrapping artifacts.
- The corpus is **incomplete**, not merely outdated — there is no clean temporal cutoff. Clean data skews heavily toward "Special Operations Forces"; the other four terms are thin.

## 4. Canonical schema (cleaned)

Keeps the original coding design; drops the junk `@dropdown` column; repairs contaminated columns.

| Field | Notes |
|---|---|
| `term_raw` | Verbatim term as used by the author |
| `universal_title` | One of: Special Forces (1), Elite Forces (2), Tactical Teams (3), Special Operations Forces (4), Other Units (5) |
| `definition_verbatim` | Exact quoted definition |
| `explanation` | Supporting/illustrative quotes |
| `definition_basis` | designation / organization / operators / role&function / combination, with the original numeric code (1–10) |
| `author` | Name(s) |
| `profession` | academic (1) / military (2) / both (3) |
| `discipline` | If academic |
| `country` | Author's country |
| `year` | 4-digit, normalized |
| `source_MLA` | Full citation |
| `page` | Page number |
| `sub_source` | Secondary source if the definition is quoted from elsewhere |
| `provenance` | `original` / `added-<date>`; `facet_of:<source>` tag for faceted rows; `needs-review` flag |

## 5. Stage 1 — Clean the dataset

**Constraint:** Drive access can read the sheet and create new files but cannot edit the existing sheet in place. The original is never overwritten.

**Approach:** clean locally (full data-processing control), then publish the result as a new Google Sheet "SOF Definitions — Clean v2."

**Rules:**
- Reconstruct true rows (repair multi-line-cell wrapping from the export).
- Drop pure artifacts (addresses, dropdown leftovers, separator rows, Tana supertag bleed).
- **Quarantine, never delete:** garbled/ambiguous rows go to a "Needs Review" tab so hidden definitions can be rescued.
- Normalize `year` to 4 digits; flag bad values.
- **Preserve existing codings** — repair alignment only; do not silently re-code the author's judgment calls.
- **Faceted SOF rows** (a single source split into Role / Missions / Organization / Mode of Operation / etc.) are **kept as separate rows but tagged** via `provenance: facet_of:<source>`, so they do not inflate definition counts.
- Produce a **change log** (fixed / dropped / quarantined).

**Output:** clean dataset (local CSV + Google Sheet), a "Needs Review" tab, and a change log.

## 6. Stage 2 — Gap-filling research workflow (Option A: research workflow, not software)

No temporal cutoff; the goal is **coverage**.

1. **Coverage map first:** profile the cleaned data by term × era × author-type × country to expose the holes (especially the four thin terms).
2. **Inclusion rule:** a source that *explicitly defines* one of the five terms (not merely uses it).
3. **Search:** academic web search + full-text fetch (Google Scholar results, journals, doctrine such as NATO / US DoD, the user's Zotero if useful), targeted at the mapped gaps.
4. **Per candidate:** extract the **verbatim** definition, propose `universal_title` and `definition_basis` codes, capture full metadata — **user approves each before it is added** (coding is a judgment call).
5. **Rounds:** small reviewable batches, not a firehose.

## 7. Stage 3 — The 1–2 page discussion

Argument-driven, not a catalog. Skeleton:

1. **The problem** — no consensus definition; the concept is dynamic and fluid.
2. **Level 1: competing terms** — SF vs. Elite vs. Tactical Teams vs. SOF vs. Other; why they aren't interchangeable.
3. **Level 2: competing definitions within a term** — divergence by basis (organization vs. operators vs. role/function), tracking author background and era.
4. **Payoff** — definition as a function of the challenge-set → varies across place and time → ties to the book thesis.

The coded dataset supplies the evidence (e.g., "of N definitions, X key on role/function vs. Y on organization").

## 8. Where things live

- Local project folder: `~/Documents/Claude/Projects/SOF-Definitions/`
  - `specs/` — this design and the implementation plan
  - data, change log, and draft to follow
- Clean data also published to a new Google Sheet in the user's Drive.

## 9. Open / deferred

- Exact search sources and query strategy refined after the coverage map exists.
- Whether to integrate the corpus into the user's existing Tana SOF research workspace — deferred; out of scope for the 1–2 page goal.
