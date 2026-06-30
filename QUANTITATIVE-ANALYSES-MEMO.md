---
title: "Quantitative analyses — consolidation, hypothesis mapping, and inclusion recommendations"
author: Ami Pedahzur
date: 2026-06-29
status: draft for author review
---

# Quantitative analyses for the SOF book — what we have, what it tests, what to keep

> **תקציר מנהלים (עברית).** מזכר זה מרכז את כל הניתוחים הכמותיים של הספר ובוחן כל אחד מול התמות וההשערות. ההבחנה המרכזית: ניתוחים הנשענים על **מקורות חיצוניים** (ניתוח 69 ההגדרות, מאגר אריכות-החיים N=90, נתוני הנופלים של ה-7/10) יכולים *לבחון* טענות; ניתוחים הנגזרים **מכתב היד עצמו** (רשת האנשים, הגנאלוגיה) *מתארים* את הטיעון מחדש ולכן תורמים בעיקר כהמחשה, לא כראיה עצמאית. המלצה בקצרה: לכלול בספר את יחס הנופלים (פרולוג), את ניתוח ההגדרות (MCA), ואת ציר-הזמן הגנאלוגי כתרשים אחד; להריץ ולכלול את ניתוח אריכות-החיים (המבחן הכמותי החזק ביותר להשערת היזמים); ולהשתמש ברשת החברתית כתרשים המחשה יחיד עם הסתייגות אנדוגניות מפורשת.

---

## 1. Purpose

Consolidate every quantitative analysis assembled for the book, test each against the book's themes and stated hypotheses, and recommend which belong in the final manuscript with a candid confidence rating. Written for the `SOF-APPENDIX` repository.

## 2. The book's themes and hypotheses (as I read them — correct freely)

- **H1 — Deep origin.** The Israeli SOF tradition begins in the 1920 Shochat–Ben-Gurion argument, not in 1948.
- **H2 — Indirect strategic capacity.** A small or non-state actor builds durable capacity through indirect means (the underground–auxiliary–guerrilla triad).
- **H3 — Improvisation against command.** Significant innovations were built by junior actors against the command and ratified after the fact (faits accomplis).
- **H4 — Doctrine by crisis.** Mobile-offensive doctrine was rediscovered under attack, not adopted by reasoned decision.
- **H5 — Entrepreneurs.** A few entrepreneurs (Sadeh, Arnan, Betser) drive the emergence and survival of units.
- **H6 — British continuity-with-catalyst.** Sadeh authored the offensive turn; Wingate professionalized it. British origin is a catalyst, not a source.
- **H7 — The concept is dynamic.** "Special operations" is a family-resemblance category that shifts across time and place.
- **H8 — Disproportion (the prologue).** SOF deliver speed and mass out of proportion to their size.

## 3. The quantitative portfolio

| # | Analysis | Source data | N | Provenance | State |
|---|---|---|---|---|---|
| A | Definitions content analysis + **MCA** | 69 coded definitions, 1944–2018 (Zotero + doctrine) | 66 codeable | **External** | Done; figures produced |
| B | **Unit longevity** & entrepreneur coding | `UNITSLongevityN_90.csv` | 90 | **External** | Coded; **analysis not yet run** |
| C | Unit genealogy / lineage **timeline** | `Units_March_20262.csv`, `prestate_units.csv`, today's draft | 30 spine / 234 full | Mixed | Draft; years unverified |
| D | **Social network** (people) | `individuals_glossary.csv` + manuscript extraction | 208 nodes / 251 ties | **Manuscript-derived** | Done; betweenness verified |
| E | Operations event sets | `reprisals.csv` (967), `attrition_operations.csv` (73), `palyam_operations1939-1948.csv` (26), `Border Wars`, `Mandate_Events_1920_1948` | up to 967 | External | Compiled; little modeling |
| F | **The Fallen, Oct 7–8** | IDF/Police records + Kan + Mapping the Massacre | 369 (60 SOF) | **External** | In prologue; method appendix drafted |
| G | Terrorism series | NSSC 1948–2005, GTD | thousands | External | Context only |
| H | IAF 1973 losses | `IAF_1973_Losses.csv` | 108 | External | Compiled |
| I | Individuals reference | `individuals_glossary.csv` (87), `individuals_global.csv` (121) | 208 | External | Feeds D |
| J | Regional/defensive units (geo) | `regional_defensive.csv` | 38 | External | Geo-coded; unmapped |

## 4. What each hypothesis can lean on

| Hypothesis | Bears on it | Evidentiary weight |
|---|---|---|
| H1 deep origin | C (timeline back to 1907), D (pre-state cluster) | Moderate — illustrative, not a test |
| H2 indirect capacity | E (Palyam/Mandate ops), J (geography), C | Moderate; descriptive |
| H3 improvisation vs command | qualitative; **no clean quantitative test** | Low — narrative carries it |
| H4 doctrine by crisis | E (reprisals tempo 1953–56), C | Moderate, if a tempo figure is built |
| **H5 entrepreneurs** | **B (longevity × entrepreneur)**, D (entrepreneurs as top brokers) | **High potential** via B; D corroborates but is endogenous |
| H6 British catalyst | D (Wingate as bridge), C (SNS as dashed input) | Moderate; D's bridge result is the cleanest exhibit |
| **H7 dynamic concept** | **A (MCA)** | **High — A is a genuine, standalone test** |
| **H8 disproportion** | **F (60/369 ratio)** | **High — already the prologue's spine** |

## 5. The decisive distinction: what tests vs what re-describes

Two analyses are built from sources **outside** the manuscript and can therefore carry evidentiary weight:
- **A (definitions MCA)** answers a question the book poses independently — is "SOF" one concept? — with a standard, replicable instrument and a clean result (no necessary element; role-and-function modal at 56%). It is the strongest piece of original quantitative scholarship in the portfolio.
- **B (longevity)** and **F (the Fallen)** are coded from records that exist independent of the book's argument, so a finding there is informative rather than circular.

Two analyses are built **from the manuscript itself**:
- **D (social network)** and **C (genealogy)** are structured re-descriptions of what the chapters already assert. When the three entrepreneurs top every centrality measure, that is partly because the manuscript was written around them. This does not make them worthless — they are excellent **exposition** — but they confirm the framing by construction and must not be presented as independent confirmation.

This is the axis on which I rate confidence below.

## 6. Recommendations for the final book

**Tier 1 — include; high confidence they add (keep).**
1. **F · The Fallen ratio (60/369).** Already load-bearing in the prologue. External data, vivid, and it operationalizes H8. *Confidence: high.* Caveat: the count of 60 depends on which units you code as SOF, which depends on the book's own definition — resolve the boundary calls flagged in the appendix (`#verify`) so the ratio is defensible.
2. **A · Definitions MCA.** Put one MCA figure and the period/region tables in the conceptual chapter; the full memo as a methods appendix. It is the portfolio's cleanest original finding and directly carries H7. *Confidence: high.* Caveat: US-weighted corpus (41/69) bounds the spatial claim — state it, as the memo already does.
3. **C · Genealogy timeline (one figure).** The swimlane communicates H1 and H6 at a glance better than prose. *Confidence: high as exposition.* Caveat: verify founding years before print; mark catalyst vs descent edges as the draft does.

**Tier 2 — include; the result is in (run 2026-06-29).**
4. **B · Longevity × entrepreneur — RUN, and it reframes H5 into a sharper claim.** Script: `longevity_analysis.py` (scipy). Headline result:

   | Test | Result |
   |---|---|
   | Std. longevity by entrepreneur (Kruskal-Wallis) | H=2.83, **p=0.24 — n.s.** Entrepreneur units do **not** last longer (founder median 0.23 < none 0.63; many founder units are short-lived seeds). |
   | **Expansion × entrepreneur (Fisher)** | **All 5 expanded units are entrepreneur-led; 0 of 79 "none" units expanded. p=0.00001.** |
   | Survival (expanded/endured) × entrepreneur | 64% vs 38%, p=0.19 — n.s. (small N). |
   | Professionalization → longevity (Mann-Whitney) | Pro/Semi-Pro mean 0.98 vs 0.54, **p=0.001.** |

   The five expanded units are **Shayetet 13, Unit 101, Sayeret Matkal, Shaldag, Maglan** — the spine of the book. So the data do **not** support "entrepreneurs make units last," but they strongly support a better claim: **organizational *expansion* is exclusive to entrepreneur-led units**, and **professionalization predicts survival**. Entrepreneurs are the necessary condition for a unit to grow into an institution or seed successors, not for mere endurance. This is a more precise and more defensible H5 than the original.

   > **Reconciled 2026-07-01.** The Round-4 survival model (log-rank p=0.086) and this longevity test (KW p=0.24) were thought to conflict; they do not — both are non-significant on *duration*, and the robust finding is *expansion*, not survival time. Full write-up + reproduced numbers: `ENTREPRENEUR-FINDING-RECONCILIATION.md`.

   *Confidence: medium-high that this belongs in the book — but conditional on one fix (below).* **Critical caveat:** the `Entrepreneur` and `Fate` codings are both the author's; if a unit was coded "transformative" *because* it expanded, the test is circular. Before printing, confirm the two variables were coded independently (ideally blind), and report inter-coder reliability on `Entrepreneur`. With independent coding, the p=0.00001 result is the strongest quantitative finding in the book; without it, it is a tautology. Also note small entrepreneur N (2 transformative, 9 founder) and 2015 right-censoring (standardized longevity = survived fraction of the founding-to-2015 window).

**Tier 3 — one exhibit, with a stated caveat.**
5. **D · Social network — one figure + the brokerage table.** Use it to *show* the lineage structure (sparse, brokered, not a dense club) and Wingate's bridge position. Pair it with an explicit sentence that the network is extracted from the manuscript and so illustrates rather than tests. *Confidence: medium as evidence; high as a visual.* Do not headline a finding with it.

**Tier 4 — appendix / replication archive (keep in repo, not in the body).**
6. **E, I, J, H.** Reprisals (967), attrition, Palyam, Mandate events, individuals, regional-defensive geography, IAF 1973. Valuable as the published data appendix and for replication; at most one descriptive figure each if a chapter calls for it (e.g., reprisal tempo 1953–56 for H4; a unit-deployment map from J for H2). *Confidence: low as in-text argument, high as archive.*

**Probably exclude from this book.**
7. **G · NSSC / GTD terrorism series.** Built for the terrorism work, not the SOF tradition. Citing them risks diffusing the book's spine. Keep for the articles. *Confidence: medium that they do not belong here.*

## 7. Open verification tasks (before any of this is print-ready)

- **B:** analysis run (`longevity_analysis.py`). **Full-N extension attempted and blocked:** `Units_March_2026_1_all.csv` has `Fate` for only ~10/233 rows in an inconsistent vocabulary, and `UNITSN_194.csv` has a founder field at 38% coverage — so the test cannot extend beyond the curated N=90 without a coding pass. Remaining work, now specified in `CODING-PROTOCOL.md`: (1) code `Entrepreneur` and `Fate` **independently** on `units_coding_template.csv` (219 units) to remove circularity; (2) re-check the five headline units blind; (3) re-run the Fisher test at full N and report Cohen's κ.
- **F:** close the `#verify` boundary calls (which units count; the Oct-8 cutoff).
- **C:** confirm unit founding years; ratify the catalyst-vs-descent edges.
- **D:** confirm tie directions and the handful of first-name-only endpoints; decide one PageRank convention (in-link PageRank ranks Sadeh first).
- **A:** none outstanding beyond restating the US-weighting limit.

## 8. Provenance note (what I can vouch for)

I recomputed and **verified** the network centrality (D) from scratch on 2026-06-29 (betweenness identical to the prior run) and **ran** the longevity analysis (B) myself (`longevity_analysis.py`, scipy). I built the genealogy timeline (C) and characterized A, E–J from the repository files and their methodological memos rather than re-running them. Confidence ratings above distinguish "verified/run," "characterized," and "pending a coding-independence check."

---

*Companion artifacts in the vault: `10 Projects/SOF Book/Reference/Manuscript Index/` — `Network — Centrality.md`, `ניתוח רשתות — מזכר מתודולוגי ומסקנות.md`, `Unit Genealogy (draft).md`, `Unit Genealogy — Timeline.svg`.*
