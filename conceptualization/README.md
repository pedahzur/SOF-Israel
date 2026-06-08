# Conceptualization — Defining Special Operations Forces

A small, reproducible study of **how the concept "special operations forces" is defined** across scholarship and doctrine, built for a chapter of a book on the global rise of Israel's SOF (Oxford University Press). It assembles a corpus of definitions, codes each one by the dimension(s) it rests on, and analyses how those dimensions vary **over time and across countries**.

## Headline findings

- **69 definitions**, published **1944–2018**, drawn from academic and doctrinal sources.
- **No common core.** No definitional element is a necessary condition; the most frequent — *role and function* — appears in only **56%** of definitions. The concept behaves as a **family-resemblance category**.
- **Temporal drift.** Definition by *designation* (institutional/command membership) peaks in the USSOCOM-building years (1990s) and fades; definition by the *operator* rises after 9/11 (2000s); definition by *role and function* dominates the 2010s (77%).
- **Spatial split.** US authors define by *designation* more than twice as often as non-US authors (29% vs 12%); non-US authors lean toward the *operator* (54% vs 32%).
- A **multiple correspondence analysis (MCA)** reproduces both patterns on one map (see `data/fig_mca.png`).

## Proposed conceptualization

> Special operations forces are military or paramilitary units defined **primarily by a distinctive role and function** — the capacity to undertake missions that fall outside, or beyond the reliable reach of, conventional forces — and **secondarily by at least one of three contingent markers**: a distinctive *organization* (selection, training, equipment), distinctive *operators* (the calibre and scarcity of their personnel), or a distinctive *designation* (formal institutional or command status). The functional core is the primary dimension; the three markers are individually substitutable and jointly sufficient. Which marker is foregrounded tracks the threat the defining state faces and its strategic culture.

This is a Goertz-style three-level concept with a primary dimension over a family-resemblance secondary level. The fluidity the book argues for lives **inside** the concept, at the substitutable secondary level.

## Method

Content analysis of definitions, after Schmid & Jongman's dissection of terrorism definitions and Weinberg, Pedahzur & Hirsch-Hoefler, "The Challenges of Conceptualizing Terrorism" (*Terrorism and Political Violence*, 2004). Each definition is coded for presence/absence of four elements — **Designation, Organization, Operators, Role & Function** (the secondary-dimension level in Goertz, *Social Science Concepts*, 2006) — then cross-tabulated by period and region, and mapped with MCA. Full method, citations, and caveats in `writing/methodological-memo.md`.

## Repository layout

```
specs/      design spec
plans/      implementation plan
data/       clean.py (the cleaning pipeline) + CSVs and figures:
              raw_export.csv ............ source export (1 Google Sheet tab)
              clean_v2.csv .............. cleaned originals (41)
              mined_candidates*.{csv,md}  definitions mined from Zotero "SOF Articles"
              clean_v3_master.csv ....... MASTER corpus (69, all fields)
              master_lean.csv ........... browsable index (no verbatim text)
              coverage_map.md ........... distributions + cross-tabs
              change_log.md ............. provenance log
              fig_period.png / fig_region.png / fig_mca.png / mca_map.svg
writing/    definitional-discussion-1page.md, -2page.md, methodological-memo.md
```

## Sources, provenance, and caveats

- Definitions were assembled from an older coded spreadsheet, extended by mining the author's Zotero "SOF Articles" collection (verbatim defining passages only), plus one open-access article retrieved from the web. Every row in `clean_v3_master.csv` keeps its full citation and a `provenance` tag.
- **Coding was AI-assisted** (PDF passages extracted by an LLM, then coded) and reflects a single coder's judgment. A second coder and an inter-coder reliability check are the obvious next step before publication.
- The corpus is **small (n = 66 coded)** and **US-weighted (41/69)**, so figures are tendencies, not significant differences, and the temporal axis is better evidenced than the spatial one.
- **Copyrighted full texts are not included** in this repository (e.g., the journal PDFs mined for definitions are excluded via `.gitignore`); only bibliographic metadata and short verbatim definitional quotations appear.

---
*Generated through an interactive Claude Code session, 2026-06-06.*
