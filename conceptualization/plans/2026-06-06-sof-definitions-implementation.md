# SOF Definitions Implementation Plan

> **For agentic workers:** This plan mixes a scripted data-cleaning stage (detailed, runnable) with two interactive stages (research + writing) that depend on Stage 1 output and ongoing user judgment. Steps use checkbox (`- [ ]`) syntax for tracking. **All Google Drive operations must run in the main interactive session** — the Drive MCP is interactively authenticated and may be absent in headless subagents.

**Goal:** Clean the existing SOF-definitions corpus into a reliable dataset, build a gap-filling research workflow to extend it, and produce a 1–2 page argument-driven discussion for the book.

**Architecture:** Pull the source sheet as proper CSV (preserves cell boundaries the markdown export mangled), clean/normalize locally in Python with data-quality assertions, publish a clean Google Sheet + Needs-Review tab + change log, then map coverage and fill gaps in reviewable rounds, then write.

**Tech Stack:** Python 3 (stdlib `csv`, `json`, `re`), Google Drive MCP (export CSV / create Sheet), web search + full-text fetch for Stage 2.

**Spec:** `~/Documents/Claude/Projects/SOF-Definitions/specs/2026-06-06-sof-definitions-design.md`
(Google Doc copy: https://docs.google.com/document/d/17edltaZ1QQsTFCIgInyi4dp2BvYyf8nxxiBzGFWdXGo/edit)

**Project root:** `~/Documents/Claude/Projects/SOF-Definitions/`
- `data/` — raw export, cleaned CSV, needs-review CSV, change log
- `specs/`, `plans/` — design + this plan

---

## STAGE 1 — Clean the dataset (detailed, runnable now)

### Task 1: Acquire a clean CSV export of the source sheet

**Files:**
- Create: `data/raw_export.csv`

- [ ] **Step 1: Export the Google Sheet as CSV** (main session)

Call the Drive tool `download_file_content` with:
- `fileId`: `1M0tM60v6vK18L7JImPIul15qLwlg4ZSMarfXmFEvPMQ`
- `exportMimeType`: `text/csv`

Note: CSV export returns only the **first/active tab**. If the genuine definitions live on a different tab, re-export with that tab active (or export as `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (xlsx) to capture all tabs, then read tabs with Python).

- [ ] **Step 2: Decode and save the export**

The tool returns base64. Save it:

```python
import base64, pathlib
b64 = "<paste base64 from tool result>"
out = pathlib.Path.home() / "Documents/Claude/Projects/SOF-Definitions/data/raw_export.csv"
out.write_bytes(base64.b64decode(b64))
print("wrote", out, out.stat().st_size, "bytes")
```

- [ ] **Step 3: Verify the export parses as a real table**

```python
import csv, pathlib
p = pathlib.Path.home() / "Documents/Claude/Projects/SOF-Definitions/data/raw_export.csv"
rows = list(csv.reader(p.open(encoding="utf-8")))
print("rows:", len(rows), "| cols in header:", len(rows[0]))
print("header:", rows[0])
```
Expected: a header row with the 15 known columns (Term, Definition, …, Title Code, @dropdown), and multi-line definitions contained **within single cells** (not spilling across rows as in the markdown export). If definitions still spill across rows, the export is wrong — stop and fix the tab/format before continuing.

### Task 2: Define the cleaning rules as explicit, testable invariants

**Files:**
- Create: `data/clean.py`

- [ ] **Step 1: Write the column map and constants**

```python
# data/clean.py
import csv, re, pathlib, json
from datetime import date

ROOT = pathlib.Path.home() / "Documents/Claude/Projects/SOF-Definitions/data"
RAW = ROOT / "raw_export.csv"

# Source column index -> canonical field name
COLMAP = {
    0:  "term_raw",
    1:  "definition_verbatim",
    2:  "explanation",
    3:  "source_MLA",
    4:  "page",
    5:  "sub_source",
    6:  "year",
    7:  "profession",          # 1 academic / 2 military / 3 both
    8:  "discipline",
    9:  "country",
    10: "definition_basis",    # textual
    11: "definition_basis_code",  # 1..10
    12: "universal_title",
    13: "title_code",          # 1..5
    # col 14 (@dropdown) intentionally dropped
}

VALID_TITLES = {"Special Forces","Elite Forces","Tactical Teams",
                "Special Operations Forces","Other Units"}
VALID_TITLE_CODES = {"1","2","3","4","5"}
CANON_FIELDS = ["term_raw","universal_title","title_code","definition_verbatim",
    "explanation","definition_basis","definition_basis_code","author","profession",
    "discipline","country","year","source_MLA","page","sub_source","provenance"]
```

- [ ] **Step 2: Write the row classifier (genuine / junk / needs-review)**

```python
TANA_BLEED = re.compile(r"[\U0001F300-\U0001FAFF]")  # emoji / supertag bleed
ADDRESSY  = re.compile(r"\b(England|USA|Abingdon|City Road|Va\b|Lexington)\b")

def classify(rec):
    """Return 'junk', 'review', or 'ok' for a canonical-record dict."""
    term = (rec.get("term_raw") or "").strip()
    defn = (rec.get("definition_verbatim") or "").strip()
    title = (rec.get("universal_title") or "").strip()
    # pure artifacts
    if term in {":-:", "Definition", "Term", ""} and len(defn) < 20:
        return "junk"
    if TANA_BLEED.search(title) or ADDRESSY.search(title):
        return "junk"
    # genuine: real term + substantive definition AND a valid normalized title
    if len(term) > 5 and len(defn) >= 40:
        if title in VALID_TITLES:
            return "ok"
        # genuine definition but missing/invalid universal_title -> quarantine
        # so a human can assign the title; never silently drop it
        return "review"
    return "review"
```

- [ ] **Step 3: Write year normalization + facet tagging**

```python
def norm_year(v):
    v = (v or "").strip()
    m = re.search(r"\b(1[89]\d\d|20\d\d)\b", v)
    return m.group(1) if m else ""

FACET = re.compile(r"\((Role|Missions?|Organization|Mode of Operation|Purposes?|"
                   r"Responsibilities|Characteristics|Groups|Strategic Utility|"
                   r"Areas of Collateral Activity)\b", re.I)

def facet_tag(term_raw):
    m = FACET.search(term_raw or "")
    if not m:
        return ""
    # base source = term up to the first parenthesis
    base = (term_raw.split("(")[0]).strip()
    return f"facet_of:{base}"
```

### Task 3: Run the cleaner and produce outputs

**Files:**
- Modify: `data/clean.py` (add main)
- Create: `data/clean_v2.csv`, `data/needs_review.csv`, `data/change_log.md`

- [ ] **Step 1: Append the main routine**

```python
def main():
    rows = list(csv.reader(RAW.open(encoding="utf-8")))
    body = rows[1:]  # drop header
    ok, review, junk = [], [], []
    for raw in body:
        if not any(c.strip() for c in raw):
            continue
        rec = {CANON_FIELDS_DEFAULT: "" for CANON_FIELDS_DEFAULT in CANON_FIELDS}
        for idx, field in COLMAP.items():
            if idx < len(raw):
                rec[field] = raw[idx].strip()
        rec["year"] = norm_year(rec.get("year"))
        ft = facet_tag(rec.get("term_raw"))
        rec["provenance"] = ("original" + (";" + ft if ft else ""))
        verdict = classify(rec)
        (junk if verdict=="junk" else review if verdict=="review" else ok).append(rec)

    def write(path, recs):
        with path.open("w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=CANON_FIELDS)
            w.writeheader(); w.writerows(recs)

    write(ROOT/"clean_v2.csv", ok)
    write(ROOT/"needs_review.csv", review)
    log = (ROOT/"change_log.md")
    log.write_text(
        f"# Change log — {date.today()}\n\n"
        f"- Input rows (excl. header): {len(body)}\n"
        f"- Clean rows kept: {len(ok)}\n"
        f"- Quarantined (needs review): {len(review)}\n"
        f"- Dropped as junk: {len(junk)}\n"
        f"- Faceted rows tagged: {sum(1 for r in ok if 'facet_of:' in r['provenance'])}\n",
        encoding="utf-8")
    print(f"ok={len(ok)} review={len(review)} junk={len(junk)}")

if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Run it**

Run: `python3 ~/Documents/Claude/Projects/SOF-Definitions/data/clean.py`
Expected: prints `ok=… review=… junk=…`; the three output files exist. Sanity target: `ok` is in the rough range of the ~44 genuine rows seen earlier (±, depending on how the proper CSV export resolves facet rows).

- [ ] **Step 3: Data-quality assertions (the "tests")**

```python
import csv, pathlib
ROOT = pathlib.Path.home()/"Documents/Claude/Projects/SOF-Definitions/data"
clean = list(csv.DictReader((ROOT/"clean_v2.csv").open(encoding="utf-8")))
VALID = {"Special Forces","Elite Forces","Tactical Teams","Special Operations Forces","Other Units"}
assert all(r["universal_title"] in VALID for r in clean), "bad universal_title survived"
assert all((r["year"]=="" or r["year"].isdigit() and len(r["year"])==4) for r in clean), "bad year survived"
assert all(len(r["definition_verbatim"])>=40 for r in clean), "empty definition survived"
print("PASS:", len(clean), "clean rows")
```
Expected: `PASS: <n> clean rows`. If an assertion fails, the classifier/normalizer needs tightening — fix in `clean.py` and re-run Step 2.

- [ ] **Step 4: Human spot-check the quarantine**

Open `data/needs_review.csv` and confirm no genuine definition was wrongly quarantined, and `data/change_log.md` numbers look sane. (User reviews; rescue anything misfiled by moving it into `clean_v2.csv`.)

### Task 4: Publish the clean dataset to Google Drive

**Files:**
- Read: `data/clean_v2.csv`, `data/needs_review.csv`

- [ ] **Step 1: Create the clean Google Sheet** (main session)

Call Drive `create_file` with `title`: `SOF Definitions — Clean v2`, `contentMimeType`: `text/csv`, `textContent`: contents of `clean_v2.csv` (CSV auto-converts to a Google Sheet). Repeat for a second file `SOF Definitions — Needs Review` from `needs_review.csv`. Report both share links to the user.

- [ ] **Step 2: Confirm with user** that Clean v2 looks right before Stage 2.

---

## STAGE 2 — Gap-filling research workflow (interactive; detail finalized after Stage 1)

> Detailed steps are deferred on purpose: the search targets come from the coverage map produced below, which doesn't exist until Stage 1 finishes. This is intended decomposition, not a placeholder.

- [ ] **Task 5: Build the coverage map.** From `clean_v2.csv`, tabulate counts by `universal_title` × decade × `profession` × `country`, and by `definition_basis`. Output `data/coverage_map.md`. Identify the thin cells (expected: SF, Elite Forces, Tactical Teams, Other; pre-1990 and post-2010 eras).
- [ ] **Task 6: Agree search targets with user.** Present the gaps; user confirms which to pursue and any must-include authors/sources (e.g., NATO AAP-06, US JP 3-05, Kiras, Gray, Spulak, McRaven, Marquis, Finlan, Tucker & Lamb).
- [ ] **Task 7: Run search rounds.** Per round: web-search + full-text fetch candidates; for each, extract the **verbatim** defining sentence(s), draft `universal_title` + `definition_basis` codes + full metadata; present a small batch for **user approval**; append approved rows to `clean_v2.csv` with `provenance: added-<date>`. Repeat until coverage is adequate or returns dry.

---

## STAGE 3 — The 1–2 page discussion (interactive; after data is adequate)

- [ ] **Task 8: Extract the evidence.** Compute the claims the prose will lean on (e.g., basis distribution by author profession/era; which terms cluster with which basis). Output `data/evidence_notes.md`.
- [ ] **Task 9: Draft the 1–2 pages** following the spec skeleton (problem → competing terms → competing definitions within a term → payoff). Argument-driven, dataset-evidenced.
- [ ] **Task 10: Tighten** with `writing-anti-ai` + `ml-paper-writing` register; verify every quoted definition against `source_MLA`/page; deliver as Markdown + a Google Doc.

---

## Notes
- Git: project root is not a git repo. Optional `git init` if version history is wanted; otherwise files are saved plainly.
- Each Stage ends at a user checkpoint; nothing in Stage 2/3 starts without Stage 1 sign-off.
